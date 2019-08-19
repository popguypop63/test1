function getInitResources() {
  return [
  familiarRes,manaRes,
  //fairyTrapRes, fairyRes, fairyDustRes,
  //fertilizerRes, magicBeansRes, mandragoraRes,
  //homonculiRes, baitDroneRes
  ];
}

const mana = { name: "Mana", id: 0, emoji: `🔮` };
const familiar = { name: "Familiar", id: 1, emoji: `🐈` };
const fairies = { name: "Fairies", id: 2, emoji: `🧚‍♂️` };
const fairyDust = { name: "Fairy Dust", id: 3, emoji: `✨` };
const fairyTraps = { name: "Fairy Traps", id: 4, emoji: `🍯` };
const unicorns = { name: "Unicorn", id: 5, emoji: `🦄` };
const vipers = { name: "Vipers", id: 6, emoji: `🐍` };
const goldenGrain = { name: "GoldenGrain", id: 7, emoji: `🌾` };
const fertilizer = { name: "Fertilizer", id: 8, emoji: `💩` };
const magicBeans = { name: "Magic Beans", id: 9, emoji: `🌰` };
const mandragora = { name: "Mandragora", id: 10, emoji: `🌱` };
const goldDust = { name: "Gold Dust", id: 12, emoji: `⚱️` };
const homonculi = { name: "Homonculi", id: 13, emoji: `👶` };
const baitDrones = { name: "Bait Drones", id: 14, emoji: `🐝` };
const venom = { name: "Venom", id: 15, emoji: `🧪`, };
const toxinDrones = { name: "Toxin Drones", id: 16, emoji: `👹` };
const bloom = { name: "Bloom", id: 16, emoji: `🌼` };
const guardDrones = { name: "Guard Drones", id: 17, emoji: `🛡️` };
const wildflowers = { name: `Wildflowers`, id: 18, emoji: `🌷` };
const alchemyLabs = { name: `Alchemy Labs`, id: 19, emoji: `⚗` };
const gems = { name: `Gems`, id: 20, emoji: `💎` };
const mushrooms = { name: `Magic Mushroom`, id: 21, emoji: `🍄` };
const zombies = { name: `Zombie Enemies`, id: 22, emoji: `🧟‍` };
//🏰🏯🏘️🐉💍🎱🍄🐇📿🖱️♞⚔️♘♜♖ 🎐⚜️⚰️🥀🐞🕷️🕸️ 

//basics
var familiarRes = new Resource(familiar, { activationDelay: 1 , vizRequirements:[{id:familiar,min:0}]},
  [new resDelta(TICK, familiar, { a: .025, b: .299 }),
  new resDelta(`Upgrade`, mana, { a: -.03, b: -.3 }),
  new resDelta(`Upgrade`, familiar, { c: 1 })] /**/ );

var manaRes = new Resource(mana, {},
[new resDelta(`Channel`, mana, { c: 1 }),
new resDelta(`Channel`, mana, { a: .001, b: .0025, c: 1 }, { chance: .01, hidden: true })]);

//fairies
const a_Bait = `Bait`;
var fairyTrapRes = new Resource(fairyTraps, {},
[ //trap fairies with mana
  new resDelta(TICK, fairies, { b: .011 }),
  new resDelta(TICK, fairyTraps, { b: -.01 }),
  new resDelta(a_Bait, mana, { a: -.01, b: -1, c: -45 }),
  new resDelta(a_Bait, fairyTraps, { c: 1 })
  ]);

var fairyRes = new Resource(fairies, {},
[ //passively generate fairy dust and magic beans
  new resDelta(TICK, fairyDust, { b: .025 }),
  new resDelta(TICK, magicBeans, { b: .005 })
  ]);

const a_Consume = `Consume`;
var fairyDustRes = new Resource(fairyDust, { vizRequirements: [{ id: fairies, min: 1 }] },
[
  new resDelta(a_Consume, mana, { c: 25 }),
  new resDelta(a_Consume, fairyDust, { c: -1 })
]);

//unicorns
const a_Summon = `Summon`;
var unicornRes = new Resource(unicorns, {},
[ //summon pooping unicorns with fairy dust
  new resDelta(TICK, mana, { a: .025, b: .299 },
      new resDelta(TICK, bloom, { b: .1 }),
      new resDelta(TICK, fertilizer, { b: .2 })),
  new resDelta(a_Summon, mana, { a: -.03, b: -.3, c: -1000 }),
  new resDelta(a_Summon, fairyDust, { b: -.3, c: -28 }),
  new resDelta(a_Summon, unicorns, { c: 1 })
]);


var bloomRes = new Resource(bloom, {},
[ //eat bloom for mana
  new resDelta(a_Consume, mana, { c: 250 }),
  new resDelta(a_Consume, bloom, { c: -1 })
]);

//vipers
const a_Charm = `Charm`;
var viperRes = new Resource(vipers, {},
[ //charm snakes with bloom
  new resDelta(TICK, venom, { b: .001 }),
  new resDelta(a_Charm, mana, { a: -.03, b: -.3, c: -50 }),
  new resDelta(a_Charm, bloom, { a: -.01, b: -.01, c: -6 }),
  new resDelta(a_Charm, vipers, { c: 1 })
  ]);

const venomRes = new Resource(venom, {}, [

]);


//gardening
const a_Refine = `Refine`;
var fertilizerRes = new Resource(fertilizer, {},
[ //play in poop and get beans soemtimes
  new resDelta(a_Refine, mana, { c: 10 }),
  new resDelta(a_Refine, magicBeans, { c: 1 }, { chance: .25, hidden: true }),
  new resDelta(a_Refine, fertilizer, { c: -5 })
]);

const a_Collect = `Collect;`
var magicBeansRes = new Resource(magicBeans, { activationDelay: 2 },
[ //collect beans from bloom
  new resDelta(a_Collect, bloom, { c: -22 }),
  new resDelta(a_Collect, magicBeans, { c: 2 })
]);

const a_Grow = `Grow`;
var goldenGrainRes = new Resource(goldenGrain, { activationDelay: 10 },
[ //grow grain from beans
  new resDelta(a_Grow, mana, { a: -.01, b: -5, c: -55 }),
  new resDelta(a_Grow, magicBeans, { c: -1 }),
  new resDelta(a_Grow, fertilizer, { c: -10 }),
  new resDelta(a_Grow, goldenGrain, { c: 10 })
]);

const goldDustRes = new Resource(goldDust, { activationDelay: 30, vizRequirements: [{ id: goldenGrain, min: 1 }] },
[ //refine golden grain into gold dust
  new resDelta(a_Refine, goldenGrain, { c: -1 }),
  new resDelta(a_Refine, mana, { c: 50 }),
  new resDelta(a_Refine, goldDust, { c: 3 })
]);

const a_Animate = `Animate`;
const alchemyLabsRes = new Resource(alchemyLabs, {activationDelay:30, vizRequirements:[{id:goldDust,min:5},{id:fertilizer,min:5}]},
[
  new resDelta(TICK,fertilizer,{b:-.001}),
  new resDelta(TICK,mana,{b:.01}),
  new resDelta(a_Animate,mana,{a:-.2,b:-99,c:-40}),
  
]);

var mandragoraRes = new Resource(mandragora, { activationDelay: 20, vizRequirements: [{ id: magicBeans, min: 1 }] },
[ //grow mandragora from beans
  new resDelta(a_Grow, mana, { a: -.005, b: -3, c: -35 }),
  new resDelta(a_Grow, magicBeans, { c: -4 }),
  new resDelta(a_Grow, fertilizer, { c: -10 }),
  new resDelta(a_Grow, mandragora, { c: 1 })
]);

//homonculi and drones
var homonculiRes = new Resource(homonculi, { activationDelay: 30, vizRequirements: [{ id: mandragora, min: 1 }] },
[
  new resDelta(TICK, mana, { b: -.001 }),
  new resDelta(a_Grow, mana, { a: -.015, b: -8, c: -35 }),
  new resDelta(a_Grow, mandragora, { c: -1 }),
  new resDelta(a_Grow, homonculi, { c: 1 })
]);

var baitDroneRes = new Resource(baitDrones, { vizRequirements: [{ id: homonculi, min: 1 }] },
[
  new resDelta(TICK, mana, { b: -.001 }),
  new resDelta(TICK, fairyTraps, { b: .25 }),
  new resDelta(a_Grow, mana, { b: -.005, c: -50 }),
  new resDelta(a_Grow, fairyDust, { b: -.0015, c: -50 }),
  new resDelta(a_Grow, homonculi, { c: -1 }),
  new resDelta(a_Grow, baitDrones, { c: 1 })
]);

var toxinDroneRes = new Resource(toxinDrones, { vizRequirements: [{ id: homonculi, min: 1 }, { id: vipers, min: 1 }] },
[
  new resDelta(TICK, mana, { b: -.002 }),
  new resDelta(TICK, gems, { b: .05 }),
  new resDelta(TICK, zombies, { b: -.005 }),
  new resDelta(TICK, zombies, { b: 3 }, { chance: .001, hidden: true }),
  new resDelta(a_Grow, mana, { b: -.0053, c: -86 }),
  new resDelta(a_Grow, venom, { b: -.0015, c: -3 }),
  new resDelta(a_Grow, homonculi, { c: -1 }),
  new resDelta(a_Grow, toxinDrones, { c: 1 })
]);

var guardDronesRes = new Resource(guardDrones, { vizRequirements: [{ id: homonculi, min: 1 }, { id: goldDust, min: 10 }] },
[
  new resDelta(TICK, mana, { b: -.001 }),
  new resDelta(TICK, zombies, { a: .0005, b: -.01 }),
  new resDelta(a_Grow, mana, { b: -.006, c: -50 }),
  new resDelta(a_Grow, goldDust, { b: -.0015, c: -3 }),
  new resDelta(a_Grow, homonculi, { c: -1 }),
  new resDelta(a_Grow, guardDrones, { c: 1 })
]);

const a_attack = `attack`;
var zombiesRes = new Resource(zombies, {},
[
  new resDelta(TICK, toxinDrones, { b: -.001 }),
  new resDelta(a_attack, venom, { c: -1 }),
  new resDelta(a_attack, mana, { c: -100 }),
  new resDelta(a_attack, bloom, { c: -30 }),
  new resDelta(a_attack, zombies, { c: -50 })
]);

var gemsRes = new Resource(gems, {},
[
  new resDelta(TICK, mana, { a: .0001, b: 9 })
]);

//const wildflowers = {name:`Wildflowers`,id:18, emoji:`🌷`};
//const mushroom = {name:`Magic Mushroom`,id:21, emoji:`🍄`};
