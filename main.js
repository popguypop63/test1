/*
Constants
*/
const sec = 1000;
const tickInterval = sec*1;
const saveInterval = sec * 10;
const catchupTicksPerTick = 50;

/*
Runtime variabls
*/
var doAutoSave = false;
var paused = false;
var resources;
var tickQueue = 0;
var activationAmount = 1;
var intervalIDs = [];
var ticks = 0;

function initializeGame() {
  load();
  //printSave();
  startTicks();
  window.onbeforeunload = stopTicks()
}

function load() {
  //calculate the ticks missed since the game was last saved
  //add the ticks to the queue to be processed
  var lastSave = Cookies.get(`lastSave`);
  var timeDiff = Date.now() - lastSave;
  tickQueue += timeDiff / (tickInterval * 2);
  //initialize the resources
  resources = [];
  var toLoad = getInitResources();
  for(var i = 0; i < toLoad.length; i++)
  {
    resources[toLoad[i].id.id] = toLoad[i];
  }
  if (resources == null || resources.length <= 0)
    console.log(`ERROR: resource initialization failure`);
  else
    //console.log(`resources initialized`);
    //wipe the resources div clean
    document.getElementById("resources").innerHTML = "";
  for (var i = 0; i < resources.length; i++) {
    if(resources[i] === undefined) continue;
    //console.log(`${resources[i]}`);
    loadResource(resources[i]);
    document.getElementById("resources").innerHTML += resourceMarkup(resources[i]);
  };
  console.log(`Load Complete. Catchup: {${Math.round(timeDiff/1000/60)} min., ${tickQueue} ticks}`);
  refreshView();
}

function loadResource(resource) {
  var loadedLevel = parseInt(Cookies.get(`r${resource.id.id}Level`));
  var loadedVisible = parseInt(Cookies.get(`r${resource.id.id}Visible`));

  //if(loadedVisible === true)
  // console.log(`loading ${resource.id.name}, viz=${loadedVisible}`);
  //console.log(`[LR] ${resource.id.name}. r.v=${resource.visible}. lv=${loadedVisible}`);

  resource.visReason = Cookies.get(`r${resource.id.id}visReason`);
  resource.visible = (isNaN(loadedVisible)?0:loadedVisible) >= 1 ? true : false;
  resource.level = isNaN(loadedLevel) ? 0 : loadedLevel;
  
  //establish group ID
  resource.allGroupIDs = [];
  for (var i = 0; i < resource.allDeltas.length; i++) {
    //if the newly declared list doesn't include the group id of the current delta
    //ignore tick deltas
    var doesInclude = resource.allGroupIDs.includes(resource.allDeltas[i].groupID);
    if (!doesInclude && resource.allDeltas[i].groupID != TICK) {
      //add the group id to the list
      resource.allGroupIDs[resource.allGroupIDs.length] = resource.allDeltas[i].groupID;
    }
  }
}


function save() {
  for (var i = 0; i < resources.length; i++) {
    var r = resources[i];
    if(r === undefined) continue;
    if (r.level !== undefined) {
      //if (r.visible && !Cookies.get(`r${r.id.id}`))
        //r.visReason += `[S:${r.visible?'t':'f'}]`;
      //Cookies.set(`r${r.id.id}visReason`, r.visReason, { expires: 2 });
      Cookies.set(`r${r.id.id}Level`, r.level, { expires: 65 });
      //if(r.visible) console.log(`${r.id.name} saving as visible. reason:${r.visReason}`);
      
      Cookies.set(`r${r.id.id}Visible`, (r.visible ? 1 : 0), { expires: 65 });
      
      Cookies.set(`lastSave`, Date.now(), { expires: 365 });
    }
  }
}

function autoSave(){
  if(doAutoSave) save();
}

function printSave() {

  for (var i = 0; i < resources.length; i++) {
    var r = resources[i];
    if(r === undefined) continue;
    //var vr = Cookies.get(`r${r.id.id}visReason`);
    var v = Cookies.get(`r${r.id.id}Visible`);
    var l = Cookies.get(`r${r.id.id}Level`);
    if (v !== undefined && l !== undefined)
      console.log(`[DEBUG] ${r.id.name} [live] viz=${r.visible}, lvl=${r.level} [CookieGet ] Viz=${v}, Lvl=${l}`);
  }
}

function reset() {
  //clear cookies
  for (var i = 0; i < resources.length; i++) {
    if(resources[i] === undefined) continue;
    Cookies.remove(`r${resources[i].id.id}Visible`);
    Cookies.remove(`r${resources[i].id.id}Level`);
    //Cookies.remove(`r${resources[i].id.id}visReason`);
  }
  console.log(`[GameReset]`);
  load();
}

function processTicks() {
  for (var i = 0; i < tickQueue && i < catchupTicksPerTick; i++) {
    tick(true);
  }
  ticks++;
  tick(false);
}

function tick(fromQueue) {
  for (var i = 0; i < resources.length; i++) {
    if(resources[i] === undefined) continue;
    if (resources[i].visible)
    {
      //console.log(`${fromQueue?`from queue`:`contemporary`}${resources.id.name} ~~tick ${resources[i].ticks}`)
      processResourceDeltas(resources[i], GetResDeltasOfGroup(resources[i].allDeltas, TICK))
    }
  }
  if(fromQueue) tickQueue--;
  if (!fromQueue) refreshView();
}


function startTicks(){
  stopTicks();
  //intervalIDs[intervalIDs.length] = window.setInterval(processTicks, tickInterval);
  //intervalIDs[intervalIDs.length] = window.setInterval(autoSave, saveInterval);
   paused = false;
   timeoutTick();
}

function timeoutTick(){
  if(!paused) setInterval(timeoutTick,tickInterval);
  processTicks();
  if(ticks % 10 == 0) save();
}

function stopTicks()
{
  paused = true;
  //for(var i = 0; i < intervalIDs.length; i++)
  //  window.clearInterval(intervalIDs[i]);
}

function isCatchingUp() { return tickQueue > 0; }

function refreshView() {
  for (var i = 0; i < resources.length; i++) {
    if(resources[i] === undefined) continue;
    updateResourceView(resources[i]);
  }
}

function getResource(index) {
  return resources[index];
}

function handleEmojiClick(index) {
  var resource = getResource(index);
  var groupID = "";
  var hasAction = false;
  
  for (var i = 0; !hasAction && i < resource.allGroupIDs.length; i++) {
    if (resource.allGroupIDs[i] != TICK) {
      hasAction = true;
      groupID = resource.allGroupIDs[i];
      
    }
  }
  //if(hasAction) console.log(`emoji click hasAction handle... ${resource.allGroupIDs[i]} is non tick`);
  if (hasAction) handleActionClick(index, groupID);
}

function handleActionClick(index, groupID) {
  var result = requestActivation(groupID, getResource(index), activationAmount);
  //console.log(`handleactionclick r=${result}`);
  if (result < activationAmount)
    console.log(`${name} resource activation failed: ${result}`);
  else
    refreshView();
}

function resourceMarkup(resource)
{
  var aDeltasInner = "";
  for(var i = 1; resource.allGroupIDs > 1 && i < resource.allGroupIDs.length; i++)
  {
    var groupID = resource.allGroupIDs[i];
    //var groupResDeltas = GetResDeltasOfGroup(resource.allDeltas,groupID);
    aDeltasInner += `<div id='${resource.id.name}_AD_${groupID}' class='actDelta'>${groupID}</div>`;
  }
  
  return `<div class='resource' id='${resource.id.name}Resource'>
  <div id='${resource.id.name}Name' class='name'>${resource.id.name}</div>
  <div id='${resource.id.name}Level' class='level'></div>
  <div id='${resource.id.name}Button' class='emoji' onClick='handleEmojiClick(${resource.id.id})'>${resource.id.emoji}</div>
  <div id='${resource.id.name}Status' class='status'></div>
  <div id='${resource.id.name}TickDelta' class='tickDelta'></div>
  <div id='${resource.id.name}ActivationDeltas' class='actions'>${aDeltasInner}</div
  
  </div>`; 
}

function labelifyDelta(resourceID, value) {
  var r = getResource(resourceID.id);
  if (!r) return ``;
  var positive = value > 0;
  var prefix = positive ? `+` : ``;
  var displayVal = Math.round(value*100)/100;
  return `<div class='rLabel${positive?"Pos":"Neg"}'>${resourceID.emoji} ${prefix} ${displayVal}</div>`;
}
