//prototype for a runtime resource instance
function Resource(identifier, config, allDeltas) {
  //identifier
  this.id = identifier;
  this.tickChance = config.tickChance ? options.tickChance : 1;
  this.activationDelay = config.activationDelay ? config.activationDelay : 0;
  this.autoViz = config.vizRequirements === undefined;
  this.vizRequirements = config.vizRequirements !== undefined ? config.vizRequirements : [];
  this.isActivating = false;
  //config
  this.allDeltas = allDeltas;
  //dependant
  //this.level = undefined;
  //this.visible = undefined;
  //.allGroupIDs = []; gets added later
}

function applyDelta(resource, deltaValue, context){
  if(context !== undefined && Math.abs(deltaValue) > 0)
    console.log(`applyDelta ${deltaValue} to ${resource.id.name}. Context=${context===undefined?"none":context}`);
  resource.level += deltaValue;
  if(resource.level <= 0) resource.level = 0;
}

function requestActivation(groupID,resource,amount){
  if(this.isActivating) return 0;
  var resDeltas = GetResDeltasOfGroup(resource.allDeltas, groupID);
  if (!canAffordResDelta(resource, resDeltas, amount)) return 0;  
  isActivating = true;
  window.setTimeout(function(){
    this.isActivating = false;
    for (var j = 0; j < amount; j++) 
      processResourceDeltas(resource, resDeltas);
  });
  return amount;
  //Delay WIP
}

function activateResourceImmediately(groupID, resource, amount) {
 
  var resDeltas = GetResDeltasOfGroup(resource.allDeltas, groupID)
  //check for affordance
  if (!canAffordResDelta(resource, resDeltas, amount)) return 0;
  //if (!canAffordResDelta(resource, resDeltas, amount)) return 0;
  for (var j = 0; j < amount; j++) 
    processResourceDeltas(resource, resDeltas);
  //console.log(`activateResource can afford ${groupID} ${resource.id.name} amount=${amount} resDeltas=${resDeltas.length}`);
  return amount;
}

//call to update the contents of a resource view
function updateResourceView(resource) {
  //console.log(`updateResourceView(${resource.id.name})`);
  if(!resource.visible && resource.autoViz)
  {
    if(resource.level >= 1)
    {
      console.log(`autoViz!! ${resource.id.name} made visible on view update`);
      resource.visReason += `[autoViz]`;
      resource.visible = true;
    }
  }
  else if(!resource.visible && resource.vizRequirements.length > 0)
  {
    var v = true;
    for(var i = 0; i < resource.vizRequirements.length; i++)
    {
      var vizReq = resource.vizRequirements[i];
      //console.log(`vr ${resource.id.name} ${vizReq.id.id}`);
      var targetResource = getResource(vizReq.id.id)
      var min = vizReq.min !== undefined ? vizReq.min:0;
      var max = vizReq.max !== undefined ? vizReq.max:Number.MAX_VALUE-10;
      v &= Boolean(targetResource.level >= min && targetResource.level <= max);
    }
    if(v && !resource.visible) 
      console.log(`[view update ${resource.id.name}] all vizReq met`);
    resource.visible = Boolean(v);
  }

  document.getElementById(`${resource.id.name}Status`).innerHTML=`${resource.isActivating ? "Activating...":"Ready"}`;
  document.getElementById(`${resource.id.name}Resource`).setAttribute(`class`, resource.visible ? `resource` : `hidden`);
  if(resource.visible)
  {
    document.getElementById(`${resource.id.name}Level`).innerHTML = `${formatNumber(Math.floor(resource.level))}`;
    updateViz(resource);
    updateDeltaView(resource);
    //console.log(`updated visible resource ${resource.id.name}`);
    var firstResDelta = undefined;
  for(var i = 0; firstResDelta === undefined && i < resource.allDeltas.length; i++)
    if(resource.allDeltas[i].groupID != TICK)
      firstResDelta = resource.allDeltas[i];
      
  var canAfford = firstResDelta === undefined || (firstResDelta !== undefined && canAffordResDelta(resource, [firstResDelta], activationAmount));
  document.getElementById(`${resource.id.name}Button`).setAttribute("class", canAfford ? "emoji" : "emoji emojiOff")
  }
};

//call to update the vizualizations for a resource, not the level display
function updateViz(resource)
{
  /*
  var romanized = (resource.level == 0) ? "" : romanize(Math.floor(resource.level));
  var id = `${resource.id.name}Viz`;
  var el = document.getElementById(id);
  if(el === null) console.log(`ERROR: el is null. id=${id}`);
  el.innerHTML = `${romanized}`;*/
}

function formatNumber(num) {
  return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}

//dynamic markup
function updateDeltaView(resource)
{
  //console.log(`updating delta views ${resource.id.name}`);
  var aDeltasInner = "";
  for(var i = 0; i < resource.allGroupIDs.length; i++)
  {
    var gid = resource.allGroupIDs[i]; //action id
    var actionDeltas =  GetResDeltasOfGroup(resource.allDeltas, gid);
    
    //console.log(`Delta: ${resource.id.name} ${gid}`);
    var label = "";
    for(var actionIndex = 0; actionIndex < actionDeltas.length; actionIndex++)
    {
      var aDelta = actionDeltas[actionIndex];
      if(!aDelta.hidden)
      {
        var divID = `${resource.id.name}_AD_${gid}`;
        var total = 0;
        for(var activation =0; activation < activationAmount;activation++)
        {
          total += EvaluateResourceDelta(resource, aDelta, activation,true);
        }
        label += labelifyDelta(aDelta.targetResourceID,total);
        
        //console.log(`setting aID=${actionIndex} ${resource.id.name} ${gid}`);
      }
    }
    aDeltasInner += `<span id='${divID}'onClick=\"handleActionClick(${resource.id.id},\'${gid}\')\"><div>${actionIndex == 0 ? "" : "👆"}${gid}</div>${label}</span>`;
      
  }//draw all actions 
  document.getElementById(`${resource.id.name}ActivationDeltas`).innerHTML = aDeltasInner;
  
  var label = "";
  //draw tick delta
  var tickDeltas = GetResDeltasOfGroup(resource.allDeltas, TICK);
  for(var i = 0; i < tickDeltas.length; i++)
  { 
    var tickDelta = tickDeltas[i];
    var val = EvaluateResourceDelta(resource, tickDelta, 0, true);
    //var valPlusOne = EvaluateResourceDelta(resource, tickDelta, 1, true);
     label += labelifyDelta(tickDelta.targetResourceID, val);
    //var plusOne = labelifyDelta(tickDelta.targetResourceID, valPlusOne);
  }
  if(label.length > 0)
      document.getElementById(`${resource.id.name}TickDelta`).innerHTML = `${label}`;
};

const CLICK = "CLICK_default";
const TICK = "TICK_default";

//resource delta prototype
function resDelta(groupID, targetResourceID, coefs, options) {
  this.groupID = groupID;
  this.targetResourceID = targetResourceID;
  this.a = coefs.a ? coefs.a: 0;
  this.b = coefs.b ? coefs.b : 0;
  this.c = coefs.c ? coefs.c : 0;

  this.hidden = options && options.hidden ? options.hidden : false;
  this.chance = options && options.chance ? options.chance : 1;
}

//resource delta functions

function resDeltaGroup(groupID, data, options){
  var group = [];
  for(var i = 0; i < data.length; i++)
  {
    var x = data[i];
    group[i] = new resDelta(groupID, x.rID, {a:(x.a?x.a:0),b:(x.b?x.b:0),c:(x.c?x.c:0)}, options);
  }
  return group
}

function GetResDeltasOfGroup(resDeltas, groupID)
{   
  var targetResDeltas = [];
  for(var i = 0; i < resDeltas.length; i++)
  {
    if(resDeltas[i].groupID == groupID)
    {
      targetResDeltas[targetResDeltas.length] = resDeltas[i];
    }
  }
  return targetResDeltas;
}

function canAffordResDelta(resource, resDeltas, amount){
  //console.log(`can afford? ${resource.id.name} x${amount} ${resDeltas}`);
 var canAfford = true;
  for (var j = 0; j < resDeltas.length; j++) {
    //console.log(`can afford? ${resource.id.name} resDeltas ${j}/${resDeltas.length}`);
    //each delta needs to be evaluated on it's own, as they target different resources
    var deltaSum = 0;
    for (var levelOffset = 0; levelOffset < amount; levelOffset++) {
      
      //sum the results of the each upgrade along the way
      deltaSum += EvaluateResourceDelta(resource, resDeltas[j], levelOffset, false);
      //console.log(`a.d. ${name} (${this.level}) ${deltaSum}`);
    }
    //every delta has to leave the target resource's level at a non negative value
  
    canAfford &= getResource(resDeltas[j].targetResourceID.id).level + deltaSum >= 0;
  
  }
 return canAfford; 
} 

function processResourceDeltas(orignatingResource, deltas, context) {
  if(context !== undefined) 
    console.log(`PROCESS DELTAS ${orignatingResource.id.name}, context=${context}`);
    for (var i = 0; i < deltas.length; i++) {
      processResourceDelta(orignatingResource, deltas[i], context);
    }
  }

function processResourceDelta(orignatingResource, resDelta, context)
{
  var tr = getResource(resDelta.targetResourceID.id);
  if(tr !== undefined)
  {
    var delta = EvaluateResourceDelta(orignatingResource, resDelta, 0, false)
    if(context !== undefined) 
      console.log(`----${resDelta.groupID} ${orignatingResource.id.name}... 
        delta=${delta} ${resDelta.targetResourceID.name}. CONTEXT=${context}`);
    applyDelta(tr,delta, context);
  }
  else{
    console.log(`processResourceDelta tr=${tr} ${orignatingResource.id.name}`);
  }
}

function EvaluateResourceDelta(orignatingResource, resDelta, levelOffset, ignoreChance){
  var doDelta = resDelta.chance >= 1 || Math.random() <= resDelta.chance;
  if(!doDelta && !ignoreChance) return 0;
  var level = orignatingResource.level + levelOffset;
  var delta = (resDelta.a * (level * level)) + (resDelta.b * level) + resDelta.c;
  return delta;
}
