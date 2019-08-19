//initialization
const sec = 1000;
const subTickInterval = sec / 10;
const tickInterval = sec;
const saveInterval = sec * 10;
const catchupTicksPerTick = 50;

var updateIntervalID;
var saveIntervalID;

var doAutoSave = false;

var resources;
var tickQueue = 0;
var activationAmount = 1;

function start() {
  load();
  printSave();
  updateIntervalID = window.setInterval(processTickQueue, tickInterval);
  saveIntervalID = window.setInterval(autoSave, saveInterval);
  window.onbeforeunload = function() {
    save();
    window.clearInterval(updateIntervalID);
    window.clearInterval(saveIntervalID);
  };
}

function load() {
  //calculate the ticks missed since the game was last saved
  //add the ticks to the queue to be processed
  var lastSave = Cookies.get(`lastSave`);
  var timeDiff = Date.now() - lastSave;
  tickQueue += timeDiff / (tickInterval * 2);
  //initialize the resources
  resources = getInitResources();
  if (resources == null || resources.length <= 0)
    console.log(`ERROR: resource initialization failure`);
  else
    //console.log(`resources initialized`);
    //wipe the resources div clean
    document.getElementById("resources").innerHTML = "";
  for (var i = 0; i < resources.length; i++) {
    //console.log(`Loading ${resources[i].id.name} from save`);
    loadResource(resources[i]);
    document.getElementById("resources").innerHTML += resourceMarkup(resources[i]);
  };
  console.log(`Load Complete. Catchup: {${Math.round(timeDiff/1000/60)} min., ${tickQueue} ticks}`);
  refreshView();
}

function save() {
  for (var i = 0; i < resources.length; i++) {
    var r = resources[i];
    if (r.level !== undefined) {
      if (r.visible && !Cookies.get(`r${r.id.id}`))
        r.visReason += `[S:${r.visible?'t':'f'}]`;
      Cookies.set(`r${r.id.id}visReason`, r.visReason, { expires: 2 });
      Cookies.set(`r${r.id.id}Level`, r.level, { expires: 65 });
      //if(r.visible) console.log(`${r.id.name} saving as visible. reason:${r.visReason}`);
      
      Cookies.set(`r${r.id.id}Visible`, Boolean(r.visible), { expires: 65 });
      
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
    var vr = Cookies.get(`r${r.id.id}visReason`);
    var v = Cookies.get(`r${r.id.id}Visible`);
    var l = Cookies.get(`r${r.id.id}Level`);
    if (v !== undefined && l !== undefined && vr !== undefined)
      console.log(`[DEBUG] ${r.id.name} [live] viz=${r.visible}, lvl=${r.level} [CookieGet ] Viz=${v}, Lvl=${l} vizReason=${vr}`);
  }
}

function reset() {
  //clear cookies
  for (var i = 0; i < resources.length; i++) {
    Cookies.remove(`r${resources[i].id.id}Visible`);
    Cookies.remove(`r${resources[i].id.id}Level`);
    Cookies.remove(`r${resources[i].id.id}visReason`);
  }
  console.log(`[[[[[[[[[[[[[GameReset]]]]]]]]]]]]]]`);
  load();
}

function loadResource(resource) {
  var loadedLevel = Cookies.get(`r${resource.id.id}Level`);
  var loadedVisible = Boolean(Cookies.get(`r${resource.id.id}Visible`));

  //if(loadedVisible === true)
  // console.log(`loading ${resource.id.name}, viz=${loadedVisible}`);
  //console.log(`[LR] ${resource.id.name}. r.v=${resource.visible}. lv=${loadedVisible}`);

  resource.visReason = Cookies.get(`r${resource.id.id}visReason`);
  resource.visible = Boolean(loadedVisible);
  resource.level = loadedLevel !== undefined ? loadedLevel : 0;
  if (resource.visible) {
    resource.vizReason += `[set:asLoaded]`;
    console.log(`${resource.id.name} loaded in visible ? history=${resource.visReason}`);
  }
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


function addTicks(amount) {
  tickQueue += amount;
}

function processTickQueue() {
  for (var i = 0; i < tickQueue && i < catchupTicksPerTick; i++) {
    tick(true);
  }
  tick();
}

function tick(skipRefresh) {
  for (var i = 0; i < resources.length; i++) {
    if (resources[i].visible)
      processResourceDeltas(resources[i], GetResDeltasOfGroup(resources[i].allDeltas, TICK))
  }
  if (!skipRefresh) refreshView();
}

function isCatchingUp() { return tickQueue > 0; }

function refreshView() {
  for (var i = 0; i < resources.length; i++) {
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
  if (hasAction) handleActionClick(index, groupID);
}

function handleActionClick(index, groupID) {
  var result = activateResource(groupID, getResource(index), activationAmount);
  if (result < activationAmount)
    console.log(`${name} resource activation failed: ${result}`);
  else
    refreshView();
}
