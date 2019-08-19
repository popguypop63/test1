//prototype for a runtime resource instance
function Resource(identifier, config, allDeltas) {
  //identifier
  this.id = identifier;
  this.tickChance = config.tickChance ? options.tickChance : 1;
  this.activationDelay = config.activationDelay ? config.activationDelay : 0;
  this.vizRequirements = config.vizRequirements ? config.vizRequirements : [];
  this.autoViz = !config.vizRequirements;
  //config
  this.allDeltas = allDeltas;
  //dependant
  //this.level = undefined;
  //this.visible = undefined;
  //.allGroupIDs = []; gets added later
}

function applyDelta(resource, deltaValue){
  this.level += deltaValue;
  if(resource.level <= 0) resource.level = 0;
}

function requestActivation(groupID,resource,amount){
  return activateResource(groupID,resource,amount);
  //Delay WIP
}

function activateResource(groupID, resource, amount) {
  var resDeltas = GetResDeltasOfGroup(resource.allDeltas, groupID);
  //check for affordance
  if (!canAfford(resource, resDeltas, amount)) return 0;
  for (var i = 0; i < resDeltas.length; i++) {
    for (var j = 0; j < amount; j++) {
      ProcessResourceDelta(resource, resDeltas[i]);
    }
  }
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
    resource.visReason += `[vizReq]`;
    resource.visible = Boolean(v);
  }

  document.getElementById(`${resource.id.name}Tier`).setAttribute(`class`, resource.visible ? `tier` : `hidden`);
  if(resource.visible)
  {
    document.getElementById(`${resource.id.name}Level`).innerHTML = `${Math.floor(resource.level)}`;
    updateViz(resource);
    updateDeltaView(resource);
    //console.log(`updated visible resource ${resource.id.name}`);
  }
};

//call to update the vizualizations for a resource, not the level display
function updateViz(resource)
{
  var activationStatus=`[ActionStatus_FPO]\n`;
  var romanized = (resource.level == 0) ? "" : romanize(Math.floor(resource.level));
  var id = `${resource.id.name}Viz`;
  var el = document.getElementById(id);
  if(el === null) console.log(`ERROR: el is null. id=${id}`);
  el.innerHTML = `${activationStatus}${romanized}`;
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
    for(var actionIndex = 0; actionIndex < actionDeltas.length; actionIndex++)
    {
      var aDelta = actionDeltas[actionIndex];
      if(!aDelta.hidden)
      {
        var divID = `${resource.id.name}_AD_${gid}`;
        var labelName = aDelta.targetResourceID.name;
        var labelVal = EvaluateResourceDelta(resource, aDelta, 0,true);
        var label = labelifyDelta(labelName,labelVal);
        
        //console.log(`setting aID=${actionIndex} ${resource.id.name} ${gid}`);
        aDeltasInner += `<div id='${divID}'onClick='handleActionClick(${resource.id.id},${gid})'>${label}</div>`;
      }
    }
  }//draw all actions 
  
  document.getElementById(`${resource.id.name}ActivationDeltas`).innerHTML = aDeltasInner;
  var tickDeltas = GetResDeltasOfGroup(resource.allDeltas, TICK);
  for(var i = 0; i < tickDeltas.length; i++)
  {  
    var tickDelta = tickDeltas[i];
    document.getElementById(`${resource.id.name}TickDelta`).innerHTML = 
      labelifyDelta(tickDelta.targetResourceID.name, 
      EvaluateResourceDelta(resource, tickDelta, 0, true));
  }
};

//must be called during game initialization
function resourceMarkup(resource)
{
  //each group id is essentially an action
  //draw all but the first action in the list.
  //the first action is reserved to be fired when the emoji is clicked
  var aDeltasInner = "";
  for(var i = 1; resource.allGroupIDs > 1 && i < resource.allGroupIDs.length; i++)
  {
    var groupID = resource.allGroupIDs[i];
    //var groupResDeltas = GetResDeltasOfGroup(resource.allDeltas,groupID);
    aDeltasInner += `<div id='${resource.id.name}_AD_${groupid}' class='actDelta'></div>`;
  }
  
  return `<div class='tier' id='${resource.id.name}Tier'>
  <div id='${resource.id.name}Name' class='name'>${resource.id.name}</div>
  <div id='${resource.id.name}Level' class='level'></div>
  <div id='${resource.id.name}Button' class='clickable emoji' onClick='handleEmojiClick(${resource.id.id})'>${resource.id.emoji}</div>
  <div id='${resource.id.name}Viz' class='viz'>v</div>
  <div id='${resource.id.name}ActivationDeltas' class='actions'>${aDeltasInner}</div>
  <div id='${resource.id.name}TickDelta' class='tickDelta'></div>
  </div>`; 
}

function labelifyDelta(name, value) {
  var r = getResource(name);
  if (!r) return ``;
  var positive = value > 0;
  var prefix = positive ? `+` : ``;
  var displayVal = Math.round(value*100)/100;
  return `<div class='rLabel${positive?"Pos":"Neg"}'>${r.id.emoji} ${prefix} ${displayVal}</div>`;
}

function romanize(num) {
  if (isNaN(num))
    return NaN;
  var digits = String(+num).split(""),
    key = ["", "C", "CC", "CCC", "CD", "D", "DC", "DCC", "DCCC", "CM",
               "", "X", "XX", "XXX", "XL", "L", "LX", "LXX", "LXXX", "XC",
               "", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX"],
    roman = "",
    i = 3;
  while (i--)
    roman = (key[+digits.pop() + (i * 10)] || "") + roman;
  return Array(+digits.join("") + 1).join("M") + roman;
}
