/*
Idle Mind ©2019 Bardic Bytes, LLC
alex@bardicbytes.com
TODO
-add delta labels with same target
-allow actions/deltas to optionally apply as much as possible when they can't afford 100% (id guard drones)
BUGS
-
*/
/*||||||||||||||||||||||||||||||||||||||||||||||||||||
  Constants
 ||||||||||||||||||||||||||||||||||||||||||||||||||||*/
const ZWSP = `​`; //zero width white space
const TICK = "TICK_default";
const sec = 1000;
const ticksPerSave = 10;
const secsPerTick = 1;
const tickInterval = secsPerTick * sec;
const catchupTicksPerTick = 500;
const COEFS_ONE = { a: 0, b: 0, c: 1 };
const COEFS_ZERO = { a: 0, b: 0, c: 0 };
const defaultActionvationDelay = COEFS_ONE;
/*||||||||||||||||||||||||||||||||||||||||||||||||||||
  Prototypes
 ||||||||||||||||||||||||||||||||||||||||||||||||||||*/
function Resource(identifier, { vizRequirements = [] } = {}, allActions) {
  //if(identifier == elementalism) console.log(`elementalism created`);
  this.level = 0;
  this.id = identifier;
  this.allActions = allActions;
  this.autoActions = getActions(allActions, true);
  this.manualActions = getActions(allActions, false);
  if (allActions.length > 0 && this.autoActions.length == 0 && this.manualActions.length == 0)
    throw new Error(`${identifier.name} has no deltas set?`);
  //console.log(`${identifier.name} created. A:${this.autoActions.length}, M:${this.manualActions.length}`);
  //config
  this.vizRequirements = vizRequirements;
  this.autoViz = this.vizRequirements.length == 0;

  //state
  this.isActivating = false;
  this.lastTickValue = 0;
}

//aka resource delta
function polyCoefs({
  a = 0,
  b = 0,
  c = 0,
  addTo = undefined,
  subFrom = undefined,
  scaleBy = undefined,
  hidden = false,
  chance = 1,
  repeat = COEFS_ZERO,
  round = false,
  min = 0,
  max = Number.MAX_VALUE,
  ceil = true,
  floor = false,
} = {}) {
  this.a = a;
  this.b = b;
  this.c = c;
  this.addTo = addTo;
  this.subFrom = subFrom;
  this.scaleBy = scaleBy;
  this.hidden = hidden;
  this.chance = chance;
  this.repeat = repeat;
  this.round = round;
  this.min = min;
  this.max = max;
  this.ceil = ceil;
  this.floor = floor;
}

//aka "action" or "tick delta"
function action(groupID, { partial = false, auto = false, activationDelay = { a: 0, b: 0, c: 1 }, vizRequirements = [] } = {}, polyCoefs) {
  this.groupID = groupID;
  this.resDeltas = polyCoefs;
  this.auto = auto;
  this.partial = partial;
  this.activationDelay = isNaN(activationDelay) ? activationDelay : { a: 0, b: 0, c: activationDelay };
  this.vizRequirements = vizRequirements;
  this.visible = false;
}

function resIdent(name, index, emoji, category, desc) {
  this.name = name;
  this.index = index;
  this.id = index; //depricated
  this.emoji = emoji;
  this.category = category;
  this.desc = desc === undefined ? `` : desc;
}
/*||||||||||||||||||||||||||||||||||||||||||||||||||||
  Runtime Variables
 ||||||||||||||||||||||||||||||||||||||||||||||||||||*/
var paused = false;
var resources = [];
var tickQueue = 0;
var activationAmount = 1;
var isInitialized = false;
var intervalIDs = [];
var ticks = 0;
var selectedCategory = -1;
/*||||||||||||||||||||||||||||||||||||||||||||||||||||
  Initialization and file IO
 ||||||||||||||||||||||||||||||||||||||||||||||||||||*/
function initializeGame() {
  //console.log("initialize skipped");
  //return;
  resources = [];

  ////the order the resources are initialized in is the order we want to draw them in
  try {
    var drawOrdered = getInitResources();
  } catch (error) {
    console.log(`resource error`);
    throw error;
  }

  //we want to be able to reference a resource by the
  //index in the identifier, even if that leaves some
  //indicies as undefiend. is this bad practice? idk
  for (var i = 0; i < drawOrdered.length; i++)
    resources[drawOrdered[i].id.index] = drawOrdered[i];

  try {
    //load each resource's save data
    actOnEveryResource(function(resource) {
      var loadedLevel = parseInt(Cookies.get(`r${resource.id.index}Level`));
      var loadedVisible = parseInt(Cookies.get(`r${resource.id.index}Visible`));
      resource.visible = (isNaN(loadedVisible) ? 0 : loadedVisible) >= 1 ? true : false;
      resource.level = isNaN(loadedLevel) ? 0 : loadedLevel;
    });
  } catch (error) {
    console.log(`[Error] failed to loaded resource.`);
    throw error;
  }

  document.getElementById(`shortbar`).innerHTML = `<span class="button" onClick="handleCategorySelect(-1)">Show All</span>`;
  for (var i = 0; i < categories.length; i++) {
    document.getElementById(`shortbar`).innerHTML += `<span class="button" onClick="handleCategorySelect(${i})">${categories[i].name}</span> `;
  }
  document.getElementById("resources").innerHTML = ""
  //draw each resource's div markup to the page once ever, thats good
  for (var i = 0; i < drawOrdered.length; i++)
    document.getElementById("resources").innerHTML += resourceMarkup(drawOrdered[i]);

  //calculate and queue missed ticks
  //this has to be improved, the whole tick queue thing...
  var timeDiff = Date.now() - Cookies.get(`lastSave`);
  if (isNaN(timeDiff)) timeDiff = 0;
  //if (!isInitialized) tickQueue += timeDiff / (tickInterval * 2);
  if (!isInitialized) console.log(`Load Complete. Catchup: {${Math.round(timeDiff/1000/60)} min., ${tickQueue} ticks}`);

  //update the display and start the game timer
  try {

    refreshView();

    if (!isInitialized) timeoutTick();

  } catch (error) {
    console.log(`[ERROR] Failed first refresh`);
    error.message = error.message;
    throw error;
  }
  isInitialized = true;
}

//used by the web ui mostly now to trigger a save
function save() {
  actOnEveryResource(function(r) { saveResource(r); });
}

//called the function that apply changes to the resource
function saveResource(r) {
  if (r !== undefined && r.level !== undefined) {
    Cookies.set(`r${r.id.index}Level`, r.level, { expires: 90 });
    Cookies.set(`r${r.id.index}Visible`, (r.visible ? 1 : 0), { expires: 90 });
  }
  Cookies.set(`lastSave`, Date.now(), { expires: 90 });
}

//used by web ui to reset a game save
function reset() {
  //clear cookies
  actOnEveryResource(function(r) {
    Cookies.remove(`r${r.id.index}Visible`);
    Cookies.remove(`r${r.id.index}Level`);
  });
  Cookies.remove(`lastSave`);
  console.log(`[GameReset]`);
  initializeGame();
}

/*||||||||||||||||||||||||||||||||||||||||||||||||||||
  Tick Management
 ||||||||||||||||||||||||||||||||||||||||||||||||||||*/
//daisy chain recursion, call once on init
function timeoutTick() {

  setTimeout(timeoutTick, tickInterval);

  //run catchup ticks
  for (var i = 0; i < tickQueue && i < catchupTicksPerTick; i++) {
    tick(true);
  }

  //run the current tick
  if (!paused) {
    //console.log(`PRETICK------------------------------${ticks}`);
    tick(false);
  }
  // all the resources get saved individually when they change
  //save based on total non-queued ticks

  if (ticks % ticksPerSave == 0) save();

}


//ticks from the queue won't trigger a screen refresh and won't be added to the tickCounter
function tick(fromQueue) {
  //console.log(`TICK${fromQueue?" from queue":""}`);
  actOnEveryResource(function(r) {
    //console.log(`[TICK] ${r.id.name} ${r.visible ? "is vis":"not vis"}`);
    if (r.visible) {
      r.lastTickValue = r.level;
      for (var i = 0; i < r.allActions.length; i++) {
        if (r.allActions[i] === undefined) console.log(`ERROR on tick() 000`);
        r.allActions[i].canAfford = canAffordAction(r, r.allActions[i], activationAmount);
      }
      for (var i = 0; i < r.autoActions.length; i++) {
        if(r.autoActions[i].visible === undefined){
           console.log(`${r.autoactions[i].groupid} undefined ACTIONs visibility`);
        }
        else if(!r.autoActions[i].visible){
          //console.log(`${r.autoActions[i].groupID} is visible = ${r.autoActions[i].visibile}`);
          continue;
        }
        if (r.autoActions[i].partial || !r.autoActions[i].canAfford) continue;

        processResourceDeltas(r, r.autoActions[i].resDeltas, {}, fromQueue);
      }
    }
  });
  if (fromQueue) {
    tickQueue--;
  } else {
    ticks++;
    refreshView();
  }

  //console.log(`TICK complete`);
}

/*||||||||||||||||||||||||||||||||||||||||||||||||||||
  web api
 ||||||||||||||||||||||||||||||||||||||||||||||||||||*/

function handleSetAllCollapsed(bool) {
  actOnEveryResource(function(r) {
    r.collapsed = Boolean(bool);
  });
}

function handleCategorySelect(index) {
  selectedCategory = index;
  refreshView();
  if (index >= 0)
    console.log(`Selected ${selectedCategory} ${categories[selectedCategory].name}`);
}

function handleCollapseToggle(resourceIndex) {
  resources[resourceIndex].collapsed = !resources[resourceIndex].collapsed;
  refreshView();
}

function handleEmojiClick(index) {
  var resource = resources[index];
  if (resource.manualActions.length <= 0) return;
  handleActionClick(index, 0);
}

function handleActionClick(resourceIndex, actionIndex) {
  //mostly a passthrough with pseudo event structure for now
  var result = requestActivation(resourceIndex, actionIndex, activationAmount, {});
  if (result < activationAmount) {
    //console.log(`${name} resource activation failed: ${result}`);
  } else {
    beep();
    refreshView();
  }
}

//currently just gonna be setup for actions.
//todo: tick/auto delta groups will activate just like non-auto/action groups. 
function requestActivation(resourceIndex, actionIndex, amount, options) {
  var r = resources[resourceIndex];
  //will we override the activation requirements and delays?
  var orActivations = options.instant !== undefined ? options.instant : false;
  //unless overriding, don't activate if the resourcing is already activating
  if (r.isActivating && !orActivations) return 0;
  //are we overriding the requirement to be able to "afford" the action?
  var orAffordance = options.affordance !== undefined ? options.affordance : false;
  //the action is a "action" with auto set to false
  var action = r.manualActions[actionIndex];
  //check if we can afford this at all or if we are overriding affordance
  if (action === undefined) console.log(`!!! ${actionIndex} of ${r.manualActions.length}`);
  if (!orAffordance && !action.canAfford && !action.partial) return 0;
  //console.log(`did afford pass`);
  //if we're not overriding the activation and we got this far, flag the resource
  r.isActivating = !orActivations;
  //skip activation and process every delta poz and neg
  if (orActivations) {
    for (var j = 0; j < amount; j++) {
      console.log(`or activation, process all`);
      processResourceDeltas(r, action.resDeltas, { context: "activation overridden" }, false);
    }
  } else {
    for (var i = 0; i < amount; i++) {
      //console.log(`activation ${i+1}`);
      //process all the negative deltas in the action first
      processResourceDeltas(r, action.resDeltas, { poz: false, neg: true, context: `neg only` }, false);
      //calc the scalar of the activation delay polynomials (what's the arithmetical jargon for that?)

      var x = action.activationDelay.scaleBy !== undefined ? resources[action.activationDelay.scaleBy.index].level : r.level;
      //console.log(x +" "+ r.level+`. ${action.groupID} ${action.activationDelay.scaleBy}`);
      //simple polynomial eval
      var delay = evaluateCoefs(x, action.activationDelay);
      //if(resources[resourceIndex].id == mana) console.log(`Mana Delay: ${delay}s. x=${x}`);
      delay = Math.max(1, delay);
      //console.log(`${r.id.name} activation timeout start ${delay}`);
      r.activationStartTime = Date.now();
      r.activationEndTime = Date.now() + delay * sec;
      window.setTimeout(function() { //after some time, process the poz deltas only
        r.isActivating = false;
        if (action.resDeltas === undefined) console.log(`act act resDeltas == undefined`);
        processResourceDeltas(r, action.resDeltas, { neg: false, poz: true, context: `poz only` }, false);
        //this might be excessive, but it's helpful for some debugging right now
        refreshView();
        boop();
      }, delay * sec);
    }
  }
  //console.log(`${r.id.name} Activation success. amount= ${amount}`);
  return amount;
}

/*||||||||||||||||||||||||||||||||||||||||||||||||||||
  Markup functions
 ||||||||||||||||||||||||||||||||||||||||||||||||||||*/
function resourceMarkup(resource) {
  var aDeltasInner = "";
  for (var i = 1; resource.allGroupIDs > 1 && i < resource.allGroupIDs.length; i++) {
    var groupID = resource.allGroupIDs[i];
    aDeltasInner += `<div id='${resource.id.name}_AD_${groupID}' class='actDelta'>${groupID}</div>`;
  }
  return `<div class='resource' id='${resource.id.name}Resource'>
  <div id='${resource.id.name}Name' class='name'>${resource.id.name}</div>
  <div class='collapse' onClick="handleCollapseToggle(${resource.id.index})">⛶</div>
  <div id='${resource.id.name}Level' class='level'></div>
  <Div id='${resource.id.name}Desc' class='desc'>${resource.id.desc}</div>
  <div id='${resource.id.name}Button' class='emoji' onClick='handleEmojiClick(${resource.id.index})'>${resource.id.emoji}</div>
  
  <div id='${resource.id.name}TickDeltas' class='tickDeltas'></div>
  <div id='${resource.id.name}Status' class='status'></div>
  <div id="${resource.id.name}Fill" class="fill"></div>
  <div id='${resource.id.name}ActivationDeltas' class='actions'>${aDeltasInner}</div>
  </div>`;
}

function labelifyDelta(resourceID, value) {
  //console.log(`${resourceID}`);
  var r = resources[resourceID.index];
  if (!r) return `labelify fail, no resource found ${typeof(resourceID)}`;
  var positive = value >= 0;
  var prefix = positive ? `+` : ``;
  var displayVal = Math.abs(value) >= 1000 ? Math.round(value) : Math.round(value * 100) / 100;
  var full = `${prefix} ${formatNumber(displayVal)}${positive ? "" : `${ZWSP}/${ZWSP}${abbreviateNumber(Math.round(r.level))}`}`;
  var perc = `${r.level >= Math.abs(value) || positive ? "" : " <div style='display:inline;font-size:.8em'>["+(Math.round( (r.level/(Math.abs(value)))*100 ))+"%]</div>"}`;
  var inner = full+perc
  return `<div class='rLabel${positive?"Pos":"Neg"}' style="${(!positive && Math.abs(value) > r.level) ? `color:red;background-color:#150606` : `color:white`}">${resourceID.emoji} ${inner}</div>`;
}

function getActionMarkup(resource, actions, actionIndex, label) {

  var a = actions[actionIndex];
  var onClickAttr = !a.auto ? `onClick=\"handleActionClick(${resource.id.index},${actionIndex})\"` : "";
  var divID = `${resource.id.name}_AD_${a.groupID}`;
  //if(resource.id === alchemyLabs && !a.auto) console.log(`alchemy lab markup? ${a.groupID} can afford?${Boolean(a.canAfford)}`)
  var actionClass = !resource.isActivating && a.canAfford ? `ready` : `notready`;
  return `<span id='${divID}' class='${actionClass}' ${onClickAttr}><div style="clear:both">${actionIndex == 0 || a.auto ? "" : "👆"}${a.groupID}</div>${label}</span>`;
}

function refreshView() {
  actOnEveryResource(function(r) {
    try {
      updateResourceView(r);
    } catch (e) {
      console.log(`error updating view on ${r.id.name}`);
      throw e;
    }
  });
}

function evalVizRequirements(vizRequirements) {
  var v = true; //assuming the result is positive, check every requirement
  for (var i = 0; i < vizRequirements.length; i++) {

    var vizReq = vizRequirements[i];
    var targetResource = resources[vizReq.id.index];
    var min = vizReq.min !== undefined ? vizReq.min : 0;
    var max = vizReq.max !== undefined ? vizReq.max : Number.MAX_VALUE;
    v &= Boolean(targetResource.level >= min && targetResource.level <= max);
  }
  return v;
}

//call to update the contents of a resource view/div
function updateResourceView(resource) {
  //console.log(`Updating Resource View: ${resource.id.name}`);
  //determine visibility
  if (!resource.visible && resource.autoViz) {
    //do autoviz.
    if (resource.level >= 1) {
      console.log(`autoViz!! ${resource.id.name} made visible on view update`);
      resource.visible = true;
    } //if there are viz requirements
  } else if (resource.vizRequirements.length > 0) {
    var v = evalVizRequirements(resource.vizRequirements);
    if (v && !resource.visible) {
      console.log(`[updateResourceView ${resource.id.name}] all vizReq met`);
    }
    resource.visible = Boolean(v);
  }

  for(var i = 0; i < resource.allActions.length;i++)
  {
    resource.allActions[i].visible = resource.allActions[i].visible 
    || resource.allActions[i].vizRequirements.length == 0 
    || evalVizRequirements(resource.allActions[i].vizRequirements); 
  }

  //set the element's class based on visibility
  var show = (resource.visible && (selectedCategory < 0 || categories[selectedCategory] == resource.id.category));
  //if(show) console.log(`updateResourceView SHOW ${resource.id.name}`);
  document.getElementById(`${resource.id.name}Resource`).setAttribute(`class`, show ? `resource` : `hidden`);
  //if it's not visible, leave it hidden and don't bother doing anything else
  if (resource.visible &&
    (selectedCategory == -1 || resource.id.category == categories[selectedCategory]) &&
    isInViewport(document.getElementById(`${resource.id.name}Resource`))) {

    //update the visualizations
    updateViz(resource);
    //update the views of actions and tick deltas
    try {
      //console.log(`x`);
      updateDeltaView(resource);
    } catch (e) {
      console.log(`failed updating delta view for ${resource.id.name}`);
      throw e;
    }
    var hasFirstAction = resource.manualActions.length > 0;
    //console.log(`${resource.id.name} first afford. action ${resource.manualActions.length} = ${resource.manualActions[0]}`);
    var canAfford = hasFirstAction && resource.manualActions[0].canAfford;
    var canAffordFirstAction = hasFirstAction ? canAfford : false;
    //console.log(`y`);
    //calcualte rate since last tick
    var rate = (resource.level - resource.lastTickValue);
    var rateText = `[${abbreviateNumber(Math.round(rate))}/s]`;
    document.getElementById(`${resource.id.name}Level`).innerHTML = `${formatNumber(abbreviateNumber(Math.floor(resource.level)))}<span>${rateText}</span>`;
    document.getElementById(`${resource.id.name}Button`).setAttribute("class", ((!hasFirstAction || canAffordFirstAction) ? (resource.isActivating ? "emoji emojiActive" : "emoji") : "emoji emojiOff"));
    //document.getElementById(`${resource.id.name}Status`).innerHTML = `${hasFirstAction ? (resource.isActivating ? "Activating...":(canAfford ? "Ready" : "Can't Afford")) : ""}`;
    var fill = 1;
    if (resource.isActivating) {
      var dur = resource.activationEndTime - resource.activationStartTime;
      var remaining = (resource.activationEndTime - Date.now());
      fill = 1 - remaining / dur;
    }
    setFill(resource.id.index, fill);
  }
};

function updateDeltaView(resource) {
  if (!resource.visible) throw new error("don't update non-visible resources");
  try {
    updateActionsView(resource, true);
  } catch (e) {
    console.log(`failed updating auto action view for ${resource.id.name}`);
    throw e;
  }
  try {
    updateActionsView(resource, false);
  } catch (e) {
    console.log(`failed updating manual action view for ${resource.id.name}`);
    throw e;
  }
  return;
};
//draw requested array of deltaGroups, aka actions,
function updateActionsView(resource, auto) {
  var idSuffix = auto ? `TickDeltas` : `ActivationDeltas`;
  document.getElementById(`${resource.id.name}${idSuffix}`).className = resource.collapsed ? "hidden" : (auto ? "tickDeltas" : "actions");
  //identify the intended actions
  var actions = auto ? resource.autoActions : resource.manualActions;
  //console.log(`updateActionsView. ${resource.id.name}. ${actions.length} ${auto ? "Auto":"Man"} actions found`);
  var allActionMarkups = "";
  //loop through every action
  for (var i = 0; i < actions.length; i++) {
    var action = actions[i];
    var v = evalVizRequirements(action.vizRequirements);
    if (!v) continue;
    var deltaLabels = "";

    establishAffectedResource(action);
    
    for (var ri = 0; ri < action.affectedResources.length; ri++)
    {
      var hidden = true;
      var totalD = 0;
      for (var j = 0; j < action.resDeltas.length; j++)
      {
        var aDelta = action.resDeltas[j];
        if (aDelta.hidden) continue;
        var scale = GetDeltaScaleLevel(resource, aDelta);
        var e = evaluateCoefs(scale, aDelta, true);
        if (aDelta.subFrom == action.affectedResources[ri]) {
          hidden = false;
          totalD -= e;
        }
        if (aDelta.addTo == action.affectedResources[ri]) {
          hidden = false;
          totalD += e;
        }
      }

      if(action.affectedResources[ri] === undefined) console.log(`~~~~~~~~~~~~~affected resource of ${action.groupID} is undefined at index ${ri}`);
      if(!hidden)
        deltaLabels += labelifyDelta(action.affectedResources[ri], totalD);
    }
    var autoExtra = auto ? `<span style="position:absolute;">⌛</span>` : ``;
    var actionIndex = i;
    var actionMarkup = getActionMarkup(resource, actions, actionIndex, `${autoExtra}${deltaLabels}`);
    //console.log(`adding markup ${actionMarkup}`);
    allActionMarkups += actionMarkup;
    //done with the action
  }

  var groupElementID = `${resource.id.name}${idSuffix}`;
  var actionsDiv = document.getElementById(groupElementID);
  if (allActionMarkups.length > 0) {
    actionsDiv.innerHTML = allActionMarkups;
  } else {
    actionsDiv.innerHTML = ``;
  }
}

function updateViz(resource) {
  //TODO something? later?
}

/*||||||||||||||||||||||||||||||||||||||||||||||||||||
  resource delta functions
 ||||||||||||||||||||||||||||||||||||||||||||||||||||*/
//for init, parses out auto actions from non-auto actions from a single array
function getActions(allActions, pickAutos) {
  //console.log(`GetActions ${pickAutos ? "A" : "M"} from ${allActions.length}. `);
  var groups = [];
  for (var i = 0; i < allActions.length; i++) {
    var action = allActions[i];
    if (action === undefined) {
      throw new Error("GetActions: Undefined Action in array");
    } else if (action.auto == pickAutos) {
      //console.log(`found one. ${allActions[i].groupID}`);
      groups[groups.length] = action;
    } else if (allActions[i].auto === undefined) {
      console.log(`${allActions[i].groupID} has ${allActions[i].auto} for 'auto' field`);
    }
  }
  //console.log(`GetActions: result count: ${pickAutos} ${groups.length}`);
  return groups;
}

//build a list of all the resources negatively affected by the action
function establishAffectedResource(action) {
  if (action.affectedResources !== undefined) return;
  action.affectedResources = [];
  for (var i = 0; i < action.resDeltas.length; i++) {
    if (action.resDeltas[i].subFrom !== undefined && !action.affectedResources.includes(action.resDeltas[i].subFrom))
      action.affectedResources[action.affectedResources.length] = action.resDeltas[i].subFrom;
    if (action.resDeltas[i].addTo !== undefined && !action.affectedResources.includes(action.resDeltas[i].addTo))
      action.affectedResources[action.affectedResources.length] = action.resDeltas[i].addTo;
  
  }
}

//used to determine if an array of reDeltas could be processed 
//without leaving one of the resources below zero 
function canAffordAction(originResource, action, amount) {
  var canAfford = true;

  establishAffectedResource(action);

  if (action.affectedResources === undefined) console.log(`ERROR. affectedresources undefined`);
  for (var i = 0; canAfford && i < action.affectedResources.length; i++) {
    var res = resources[action.affectedResources[i].index];
    //check how each resource is affected by all the deltas
    for (var j = 0; canAfford && j < action.resDeltas.length; j++) {
      var resDelta = action.resDeltas[j];
      if (resDelta === undefined) {
        console.log(`?!!?  ${action.groupID} resDelta/coef at index ${j} of ${action.resDeltas.length} = ${action.resDeltas[j]}`);
        continue;
      }

      var subFrom = resDelta.subFrom;
      if (subFrom === undefined || subFrom != res.id) {
        continue;
      }
      var scale = GetDeltaScaleLevel(originResource, resDelta);
      var costSum = 0
      for (var levelOffset = 0; levelOffset < amount; levelOffset++) {
        costSum += evaluateCoefs(scale, resDelta);
      }
      canAfford &= (res.level - costSum) >= 0;
      //if(!canAfford) console.log(`can't afford ${action.groupID} - ${costSum}`);
    }
  }
  return canAfford;
}

//options: poz, neg, context
function processResourceDeltas(orignatingResource, resDeltas, options, fromQueue) {
  var context = options.context ? options.context : undefined;
  var poz = options.poz !== undefined ? options.poz : true;
  var neg = options.neg !== undefined ? options.neg : true;
  if (resDeltas === undefined) console.log(`ERROR resDeltas == undefined`);

  //repeat, round
  for (var i = 0; i < resDeltas.length; i++) {
    var resDelta = resDeltas[i];
    var iterations = 1 + evaluateCoefs(orignatingResource.level, resDelta.repeat);
    var scale = GetDeltaScaleLevel(orignatingResource, resDelta);

    if (neg && resDelta.subFrom !== undefined)
      applyDelta(resDelta, scale, resDelta.subFrom, !fromQueue, true);
    if (poz && resDelta.addTo !== undefined)
      applyDelta(resDelta, scale, resDelta.addTo, !fromQueue, false);
  }
}

function applyDelta(coefs, x, targetID, save, subtract = false) {
  if (isNaN(resources[targetID.index].level)) throw new Error(`applyDelta, target (${targetID.name}) level is NaN`)();
  var evalX = evaluateCoefs(x, coefs);
  if (coefs.round) evalX = Math.round(eval);
  var diff = evaluateCoefs(x, coefs) * (subtract ? -1 : 1);
  if (isNaN(diff)) throw new Error(`applyDelta ${subtract ? "sub from" : "add to"} ${targetID.name} result is nan`);
  resources[targetID.index].level += diff;
  if (resources[targetID.index].level < 0) resources[targetID.index].level = 0;

  if (save)
    saveResource(resources[targetID.index]);
}

function GetDeltaScaleLevel(originResource, resDelta) {
  if (resDelta === undefined) console.log(`GetDeltaScaleLevel: resDelta is undefined`);
  if (resDelta.scaleBy !== undefined) {
    return resources[resDelta.scaleBy.index].level;
  } else {
    return originResource.level;
  }
}


/*Santa's Little Helpers*/
//coefs=a,b,c

function evaluateCoefs(x, coefs, ignoreChance) {
  var passChance = ignoreChance || coefs.chance >= 1 || Math.random() <= coefs.chance;
  if (!passChance) return 0;
  var raw = coefs.a * (x * x) + coefs.b * x + coefs.c;
  if(coefs.round) return Math.round(raw);
  if(coefs.ceil) return Math.ceil(raw);
  if(coefs.floor) return Math.floor(raw);
  return raw;
}

function formatNumber(num) {
  return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}

function abbreviateNumber(value) {
  var newValue = value;
  if (value >= 1000) {
    var suffixes = ["", "k", "m", "b", "t"];
    var suffixNum = Math.floor(("" + value).length / 3);
    var shortValue = '';
    for (var precision = 2; precision >= 1; precision--) {
      shortValue = parseFloat((suffixNum != 0 ? (value / Math.pow(1000, suffixNum)) : value).toPrecision(precision));
      var dotLessShortValue = (shortValue + '').replace(/[^a-zA-Z 0-9]+/g, '');
      if (dotLessShortValue.length <= 2) { break; }
    }
    if (shortValue % 1 != 0) shortNum = shortValue.toFixed(1);
    newValue = shortValue + suffixes[suffixNum];
  }
  return newValue;
}

function actOnEveryResource(func) {
  for (var i = 0; i < resources.length; i++) {
    if (resources[i] !== undefined)
      func(resources[i]);
  }
}

function setFill(resourceIndex, amount) {
  var r = resources[resourceIndex];
  var e = document.getElementById(`${r.id.name}Fill`);
  e.setAttribute("style", `width:${amount*100}%; background-color:${r.manualActions.length > 0 && r.manualActions[0].canAfford || r.manualActions.length == 0 ? (r.isActivating ? "yellow" : (r.manualActions.length > 0 ? "green" : "transparent")) : "red"}`);
}

function isInViewport(elem) {
  var bounding = elem.getBoundingClientRect();
  return (bounding.top >= -document.documentElement.clientHeight
    //&& bounding.left >= 0
    &&
    bounding.bottom <= (window.innerHeight || document.documentElement.clientHeight) + document.documentElement.clientHeight
    //&& bounding.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
};

function scaleCoefs(coefs, scaleFactor) {

}
