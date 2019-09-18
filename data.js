function getInitResources() {
  return [
  tutorialRes, manaRes, familiarRes,
  elementalismRes, herbalismRes, bestiaryRes, bloodMagicRes, alchemyLabsRes,

  gemsRes, fairyDustRes, bloomRes, magicBeansRes, fertilizerRes,
  inkRes, goldDustRes, wildflowersRes, venomRes,

  goldMilldRes,squidRes,
  fairyRes, unicornRes,
  viperRes, broodMotherRes,
  controlWeatherRes,

  goldenGrainRes, mandragoraRes,

  homonculiRes, chimerasRes, baitDroneRes,
  attackDroneRes, guardDronesRes, zombiesRes, cleanseRes,
  ];
}

//categories
const spellcraftCat = { name: `Research & Spellcraft` };
const componentsCat = spellcraftCat;

const creatureCat = { name: `Bestiary` };
const autoCat = { name: `Automation` };
const herbalismCat = { name: `Crafting` };
const socialCat = { name: `Politics` };
const enemiesCat = { name: `Dangers` };
const spellsCat = { name: `Grimoire` }
const dronesCat = autoCat;

const categories = [spellcraftCat, spellsCat, creatureCat, autoCat, herbalismCat, enemiesCat];

//resource identifiers
//tier1
const mana = new resIdent("Mana", 0, `🧘`, componentsCat, `breathe in, breathe out`);
const familiar = new resIdent("Familiar", 1, `🐈`, spellcraftCat, `your magical spirit guide`);
const fairyDust = new resIdent("Pixie Dust", 3, `✨`, componentsCat, `all you need is a little faith, trust, and...`);
const fairies = new resIdent("Fairies", 2, `🧚‍♂️`, creatureCat, `I don't believe in fairies.`);
const unicorns = new resIdent("Unicorn", 5, `🦄`, creatureCat, `Omnivourous and competative, they will never admit their natural hair color`);
const vipers = new resIdent("Basilisk", 6, `🐍`, creatureCat, `Spoopy snek`);
const goldenGrain = new resIdent("GoldenGrain", 7, `🌾`, herbalismCat, `Not for eating!`);
const mandragora = new resIdent("Mandragora", 10, `🌱`, herbalismCat, `Pull it out, slap it, cover your ears. `);
const fertilizer = new resIdent("Fertilizer", 8, `💩`, herbalismCat, `Magic glitter Poo`);
const magicBeans = new resIdent("Magic Beans", 9, `🌰`, herbalismCat, `as magic as they are bean`);
const bloom = new resIdent("Rare Bloom", 24, `🌼`, componentsCat, `makes a delicious tea that will have you tripping balls`);
const broodMother = new resIdent(`Brood Mother`, 27, `💚`, creatureCat, `It's a living.`);
const venom = new resIdent("Venom", 15, `☠️`, componentsCat, `...like a turd, in the wind...`);
const goldDust = new resIdent("Gold Dust", 12, `⚱️`, componentsCat, `just pretend it's in the vase`);
const homonculi = new resIdent("Homonculi", 13, `️️👶`, dronesCat, `lazy is a weigh of life`);
const baitDrones = new resIdent("Bait Drones", 14, `🐝`, dronesCat, `sticky babies`);
const attackDrones = new resIdent("Attack Drones", 16, `👹`, dronesCat, `collect gems`);
const guardDrones = new resIdent("Guard Drones", 17, `🛡️`, dronesCat, `destroy attacking zombies`);
const zombies = new resIdent(`Feral Zombie`, 22, `🧟‍`, enemiesCat, `[These are bad to have]</br>pillages gems and damages attack drones`);
const wildflowers = new resIdent(`Wildflowers`, 18, `🌷`, componentsCat, `Where did they come from? Where do they go?`);
const alchemyLabs = new resIdent(`Alchemy Labs`, 19, `⚗`, autoCat, `brew, ha ha`);
const gems = new resIdent(`Soul Gems`, 20, `💠`, componentsCat, `where did the soul come from?`);
const mushrooms = new resIdent(`Magic Mushroom`, 21, `🍄`, componentsCat, `classic`);
const trust = new resIdent(`Local's Trust`, 25, `🏰`, socialCat, `keep you friends close`);
const controlWeather = new resIdent(`Control Weather`, 26, `🌦️`, spellsCat, `improve crop yields`);
const goldMill = new resIdent(`Gold Mill`, 28, `️️⚙️`, autoCat, `don't forget to plant golden grain`);
const bloodMagic = new resIdent(`Blood Magic`, 30, `💉`, componentsCat, `[New Spells up to level 5]</br>mproves homonculi spawning`);
const herbalism = new resIdent(`Herbalism`, 31, `🌿`, spellcraftCat, `[New Spells up to level 3]</br>grow weeds every day`);
const elementalism = new resIdent(`Elementalism`, 33, `🌬️`, spellcraftCat, `[New Spells up to level 10]</br>Earth, Fire, Air, Water. You are the avatar`);
const bestiary = new resIdent(`Bestiary Arcanum`, 35, `📕`, spellcraftCat, `[New Spells up to level 4]</br>cryptid wiki, but made of dead trees`);
const chimeras = new resIdent(`Chimeras`, 40, `👯‍♂️`, autoCat, `Genderless constructs`);
const villager = new resIdent(`Villager Requests`, 11, `🙇`, socialCat, `Halp?`);
const necronomicon = new resIdent(`Necronomicon`, 38, `📖`, spellcraftCat, `[New Spells up to level ?]</br>reading is hard`);
const cleanse = new resIdent(`Cleanse Undead`, 39, `📿`, spellsCat,`Your turn!`);
const ink = new resIdent(`️️Enchanted Ink`, 23, `️️️✒`, spellcraftCat, `Pixie dust pigment mixed with your own cosmic power`);
const squid = new resIdent(`Psychic Squid`,32,`🦑`,creatureCat, `You don't need to read the flavor text, cause you already know what it says.`);
const owl = new resIdent(`Owl`, 40, `🦉`, creatureCat, `How many licks...?`);
const tutorial = new resIdent(`Tutor`, 4, `🤖`, spellcraftCat,`This is Tutor's flavor text. Tutor is a "resource". Get Tutor over level 3 to start the game.`);

//next = 41,36,37,4


//🏯🏘️🐉💍🎱🍄🐇📿🖱️🎐⚜️⚰️🥀🐞🕷️🎪⏳🌠⭐🏆🎂🏭
// 🧠👩‍🎤🔥⚓🔪✂️🔱👑🍓💀👻🍀🍃🍎🍒🍖🦀🍰🌊💧
//👣☠🤖⛤🔮⛓️🌛🦇🐾🕊🦉🐚🦋🍪🍽🏺🌋🏝⛪⛲🎀🎴☣️
//🍏📚📕 📘📖🔖📓📒💢🤲🍂🎃☕🧗🔗🔭💉🚪🧹🗿💫💨🏛️🏚️📜
//simple win10 ⚖🗝🗡🕸🌪❄☄⚔
//simple 🜃🜁🜂🜄 🜘🜺🜏🜓🝮🕮⚤⛨⛧♞♘♜♖️
//not Win10 🧺🧵🧶🎭🎨📯🔔🎶🥁🏮🦴🦵🧴

const TierX = { a: 1, b: 1, c: 1 };
const coefTiers = [
  TierX,
  { a: 5, b: 25, c: 10 },
  { a: 10, b: 175, c: 75 },
  { a: 15, b: 500, c: 250 },
  { a: 25, b: 7500, c: 5000 }
];

function tiers(i = 0) { return coefTiers[i]; }

function flat(i = 0, { c = tiers(i).c } = {}) { return { a: 0, b: 0, c: c }; }
function lin(i = 0, { b = tiers(i).b, c = tiers(i).c } = {}) { return { a: 0, b: b, c: c }; }
function exp(i = 0, { a = tiers(i).a, b = tiers(i).b, c = tiers(i).c } = {}) { return { a: a, b: b, c: c }; }

function gain(add, coefs, scale) { return new polyCoefs({ a: coefs.a, b: coefs.b, c: coefs.c, addTo: add, scaleBy: scale }); }
function cost(sub, coefs, scale) { return new polyCoefs({ a: coefs.a, b: coefs.b, c: coefs.c, subFrom: sub, scaleBy: scale }); }

function lowSecDelay(scale, { a = 0, b = .1, c = 1 } = {}) { return new polyCoefs({ a: a, b: b, c: c, scaleBy: scale }); }
function medSecDelay(scale, { a = 0, b = 1, c = 3 } = {}) { return new polyCoefs({ a: a, b: b, c: c, scaleBy: scale }); }
function highSecDelay(scale, { a = 0, b = 2, c = 5 } = {}) { return new polyCoefs({ a: a, b: b, c: c, scaleBy: scale }); }

var tutorialNext = new action(`Press here or the icon to activate the first action if there is more than one action.`, {activationDelay:medSecDelay()},[gain(tutorial,{c:1})])
var tutorialSubtract = new action(`Extra actions might reduce the number of resources, and must be pressed directly.`,{vizRequirements:[{id:tutorial,min:1}]},[cost(tutorial,flat())]);
var tutorialAuto = new action(`Some actions automatically happen every tick.`,{auto:true,vizRequirements:[{id:tutorial,min:2}]},[new polyCoefs({subFrom:tutorial,b:.005,ceil:false})])
var tutorialSkip = new action(`Press here to SKIP TUTORIAL.`, {},[gain(tutorial,flat(1))]);
var tutorialRes = new Resource(tutorial, {vizRequirements:[{id:tutorial, min:0, max:3}]},[tutorialNext,tutorialSubtract,tutorialAuto,tutorialSkip])

//resource defnitions
var manaChannel = new action(`Channel`, { activationDelay: lowSecDelay(familiar) }, [gain(mana, lin(0,{c:0}), alchemyLabs),gain(mana, lin(0,{c:0}), bloodMagic),gain(mana, lin(0,{c:0}), bestiary),gain(mana, lin(0,{c:0}), herbalism),gain(mana, lin(0,{c:0}), elementalism),gain(mana, lin(0), familiar)]);
var fairyDustConsume = new action(`Snort Fairy Dusy`, { activationDelay: medSecDelay(herbalism), vizRequirements: [{ id: herbalism, min: 1 }] }, [gain(mana, lin(1), herbalism), cost(fairyDust, lin(1), herbalism)]);
var manaRes = new Resource(mana, { vizRequirements: [{ id: tutorial, min: 3.1 }] }, [manaChannel,fairyDustConsume]);

var familiarTick = new action(`Generate`, { auto: true }, [gain(mana, lin(0, { c: 0 }))]);
var familiarUpgrade = new action(`Commune`, { auto: false, activationDelay: medSecDelay(familiar) }, [cost(mana, exp(1,{c:13}), familiar), gain(familiar, flat(0))]);
var familiarEmpower = new action(`Elemental Empowerment`, { activationDelay: highSecDelay(familiar), vizRequirements: [{ id: elementalism, min: 10 }] },
  [cost(mana, exp(3), elementalism), cost(bloom, exp(), elementalism), cost(goldDust, exp(), elementalism), cost(gems, exp(), elementalism), gain(familiar, lin(1), elementalism)]);
var familiarRes = new Resource(familiar, { vizRequirements: [{ id: mana, min: 1 }] }, [familiarTick, familiarUpgrade]);

var elementalismInvoke = new action(`Invoke`, { activationDelay: medSecDelay() }, [cost(mana, exp(3,{c:(tiers(2).c/2)})), gain(elementalism, flat())]);
var elementalismTrance = new action(`Trance`, { auto: true }, [gain(mana, lin(0, { c: 0 }))]);
var elementalTattoo = new action(`Tattoo`, {activationDelay: highSecDelay(), vizRequirements:[{id:bloodMagic,min:2}]}, [cost(mana,exp(3)), cost(ink,exp(1)), gain(elementalism, lin(0,{c:-1}), bloodMagic)]);
var elementalismRes = new Resource(elementalism, { vizRequirements: [{ id: familiar, min: 1 }] }, [elementalismInvoke, elementalismTrance,elementalTattoo]);

var inkCraft = new action(`Infuse`, { activationDelay: lowSecDelay(elementalism) }, [cost(mana, lin(1), elementalism), cost(fairyDust, lin(1), elementalism), gain(ink, lin(0), elementalism)])
var inkRes = new Resource(ink, { vizRequirements: [{ id: fairyDust, min: 1 }] }, [inkCraft])

//var bestiaryResearch = new action(`Field Research`, {activationDelay: highSecDelay()},[cost(mana,exp(3)), cost(ink,lin(1),)]);
var bestiaryDocument = new action(`Document`, { activationDelay: medSecDelay() }, [cost(mana, exp(2)), cost(ink, lin(1)), gain(bestiary, flat())]);
var bestiaryTick = new action(`Expanded Mind`, { auto: true }, [gain(mana, lin(0, { c: 0 }))]);
var bestiaryRes = new Resource(bestiary, { vizRequirements: [{ id: fairies, min: 1 }] }, [bestiaryDocument, bestiaryTick]);

var squidSummon = new action(`Forge Treaty (x${bestiary.id.emoji})`, {activationDelay:lowSecDelay()}, [cost(mana,exp(3),bestiary),cost(ink,exp(),bestiary), gain(squid,lin(),bestiary)]);
var squidTrade = new action (`Trade`, {auto:true},[cost(fairyDust,lin(0,{c:0})), gain(ink,lin(0,{c:0}))]);
var squidRes = new Resource(squid, {vizRequirements:[{id:bestiary,min:2}]},[squidSummon,squidTrade]);

var bloodMagicPractice = new action(`Practice`, { activationDelay: medSecDelay() }, [cost(mana, exp(3)), cost(venom, exp(1)), cost(goldDust, exp(1)), gain(bloodMagic, flat())]);
var bloodMagicTick = new action(`Expanded Mind`, { auto: true }, [gain(mana, lin(0, { c: 0 }))]);
var bloodMagicRes = new Resource(bloodMagic, { vizRequirements: [{ id: alchemyLabs, min: 1 }] }, [bloodMagicPractice, bloodMagicTick]);

var herbalismExperiment = new action(`Experiment`, { activationDelay: medSecDelay() }, [cost(mana, exp(3)), cost(bloom, exp(1)), cost(ink,lin(1)) ,gain(herbalism, flat())]);
var herbalismTick = new action(`Incense`, { auto: true }, [cost(wildflowers, lin(0,{c:0})), gain(mana, lin(0, { c: 0 }))]);
var herbalismRes = new Resource(herbalism, { vizRequirements: [{ id: wildflowers, min: 1 }] }, [herbalismExperiment, herbalismTick]);

var necronomiconRes = new Resource(necronomicon, { vizRequirements: [{ id: zombies, min: 666 }] }, []);

var fairyGift = new action(`Gift`, { auto: true }, [gain(fairyDust, lin(0, { c: 0 })), new polyCoefs({ addTo: magicBeans, b: .01, hidden: true })]);
var fairyCatch = new action(`Capture`, { activationDelay: medSecDelay(bestiary) }, [cost(mana, exp(2), bestiary), gain(fairies, lin(), bestiary)])
var fairyRes = new Resource(fairies, { vizRequirements: [{ id: elementalism, min: 1 }] }, [fairyGift, fairyCatch]);

var fairyDustRes = new Resource(fairyDust, {}, []);

var unicornWrangle = new action(`Wrangle`, { activationDelay: highSecDelay() }, [cost(mana, exp(0)),cost(mana, exp(2), bestiary), cost(fairyDust, exp(1), bestiary), gain(unicorns, lin(), bestiary)]);
var unicornGift = new action(`Gift`, { auto: true }, [gain(wildflowers, lin(0, { c: 0 })), new polyCoefs({ addTo: bloom, b: .05, hidden: true }), gain(fertilizer, lin(0, { c: 0 }))]);
var unicornRes = new Resource(unicorns, { vizRequirements: [{ id: bestiary, min: 1 }] }, [unicornGift, unicornWrangle]);

var wildflowersRes = new Resource(wildflowers, {}, []);

var bloomCollect = new action(`Collect`, { activationDelay: lowSecDelay(herbalism) }, [gain(bloom, lin(), herbalism), cost(wildflowers, lin(), herbalism)]);
var bloomRes = new Resource(bloom, { vizRequirements: [{ id: wildflowers, min: 1 }] }, [bloomCollect]);

var viperCharm = new action(`Charm`, { activationDelay: lowSecDelay(bestiary) }, [cost(mana, exp(1)), cost(bloom, exp(1)), gain(vipers, lin(), bestiary)]);
var viperMilk = new action(`Milk`, { auto: true }, [gain(venom, lin(0, { c: 0 }))]);
var viperRes = new Resource(vipers, { vizRequirements: [{ id: bestiary, min: 4 }] }, [viperCharm, viperMilk]);

var venomRes = new Resource(venom, {}, []);


var beanChance = new polyCoefs({ addTo: magicBeans, b: tiers(0).b, c: tiers(0).c, chance: .25, hidden: true });

//gardening
var fertDeltas = [gain(goldDust, lin(), alchemyLabs), gain(mana, lin(2), alchemyLabs), beanChance, cost(fertilizer, lin(2), alchemyLabs)];
var fertilizerRefine = new action(`Refine`, { activationDelay: medSecDelay(alchemyLabs) }, fertDeltas);

var fertilizerRes = new Resource(fertilizer, { activationDelay: 12 }, []);

var magicBeansCollect = new action(`Collect`, { activationDelay: medSecDelay(herbalism) }, [cost(mana, lin(1), herbalism), cost(bloom, flat()), gain(magicBeans, lin(), herbalism)]);
var magicBeanConsume = new action(`Consume`, { activationDelay: lowSecDelay(herbalism) }, [gain(mana, lin(2), herbalism), cost(magicBeans, flat())]);
var magicBeansRes = new Resource(magicBeans, { vizRequirements: [{ id: herbalism, min: 1 }] }, [magicBeansCollect]);

var goldenGrainGrow = new action(`Grow`, { activationDelay: medSecDelay(herbalism) },
  [cost(mana, exp(1), herbalism), cost(magicBeans, lin(), herbalism), cost(fertilizer, lin(1), herbalism), gain(goldenGrain, lin(), herbalism), gain(goldenGrain, lin(0, { c: 0 }), controlWeather)]);
var goldenGrainRes = new Resource(goldenGrain, { vizRequirements: [{ id: herbalism, min: 1 }] }, [goldenGrainGrow]);

var goldDustRefine = new action(`Refine`, { activationDelay: medSecDelay(alchemyLabs) },
  [cost(goldenGrain, lin(0), herbalism), cost(mana, exp(2), herbalism), gain(goldDust, lin(0), herbalism)]);
var goldDustRes = new Resource(goldDust, { vizRequirements: [{ id: goldenGrain, min: 1 }] }, [goldDustRefine]);


//turns fertilizer into mana automatically
//upgrades with costs mana and gold dust
var alchemyLabRefine = new action(`Refine`, { auto: true }, [cost(fertilizer, lin(0, { c: 0 })), gain(mana, lin(0, { c: 0 }))]);
var alchemyLabUpgrade = new action(`Upgrade`, { activationDelay: highSecDelay(alchemyLabs) },
 [cost(mana, exp(3)), cost(goldDust, exp(1)), cost(venom, exp(1)), gain(alchemyLabs, flat())]);
var alchemyLabsRes = new Resource(alchemyLabs, { vizRequirements: [{ id: herbalism, min: 3 }] }, [alchemyLabRefine, alchemyLabUpgrade]);

var mandragoraGrow = new action(`Grow`, { activationDelay: medSecDelay(herbalism) },
  [cost(mana, exp(2), herbalism), cost(magicBeans, lin(0), herbalism), cost(fertilizer, lin(0), herbalism), gain(mandragora, lin(0), herbalism), gain(mandragora, lin(0, { c: 0 }), controlWeather)]);
var mandragoraRes = new Resource(mandragora, { vizRequirements: [{ id: herbalism, min: 2 }] }, [mandragoraGrow]);

//homonculi and drones
var homonculiSow = new action(`Reap & Sow`, { auto: true }, [cost(magicBeans, lin(1, { c: 0 })), cost(fertilizer, lin(1, { c: 0 })), gain(mandragora, lin(0, { c: 0 })), gain(goldenGrain, lin(0, { c: 0 }))]);
var homonculiVivify = new action(`Vivify`, { activationDelay: medSecDelay() }, [cost(mana, exp(3)), cost(mandragora, exp(0)), gain(homonculi, lin(0,{c:-1}), bloodMagic)]);
var homonculiRes = new Resource(homonculi, { vizRequirements: [{ id: bloodMagic, min: 1 }] }, [homonculiSow, homonculiVivify]);

var baitDroneBait = new action(`Bait`, { auto: true }, [cost(mana, lin(1, { c: 0 })), gain(fairies, lin(0, { c: 0 }))]);
var baitDroneTreats = new action(`Prepare Treats`, { auto: true }, [cost(mana, lin(2, { c: 0 })), cost(fairyDust, lin(0, { c: 0 })), gain(unicorns, lin(0, { c: 0 }))])
var baitDronePromote = new action(`Promote`, { activationDelay: medSecDelay(bloodMagic) },
  [cost(mana, exp(3)), cost(fairyDust, exp(1)), cost(homonculi, lin(0, {c:-2}), bloodMagic), gain(baitDrones, lin(0, {c:-2}), bloodMagic)]);
var baitDroneRes = new Resource(baitDrones, { vizRequirements: [{ id: bloodMagic, min: 3 }] }, [baitDroneBait, baitDroneTreats, baitDronePromote]);


// Attack Drones
var toxinDronePillage = new action(`Pillage`, { auto: true }, [gain(gems, lin(0, { c: 0 }))]);
var toxinDronePromote = new action(`Promote`, { activationDelay: medSecDelay(alchemyLabs) }, [cost(mana, exp(3)), cost(venom, exp(0)), cost(homonculi, lin(0), alchemyLabs), gain(attackDrones, lin(0), alchemyLabs)]);
var attackDroneRes = new Resource(attackDrones, { vizRequirements: [{ id: homonculi, min: 1 }, { id: alchemyLabs, min: 2 }] }, [toxinDronePillage, toxinDronePromote]);

//Guard Drones
var guardDroneDefend = new action(`Defend`, { auto: true , partial:true}, [cost(mana, lin(0, { c: 0 })), new polyCoefs({subFrom:zombies,a:tiers(0).a,b:tiers(0).b})]);
var guardDronePromote = new action(`Promote`, { activationDelay: medSecDelay(alchemyLabs) },
  [cost(mana, exp(1)), cost(goldDust, exp(0)), cost(homonculi, lin(0), alchemyLabs), gain(guardDrones, lin(0), alchemyLabs)]);
var guardDronesRes = new Resource(guardDrones, { vizRequirements: [{ id: homonculi, min: 1 }, { id: alchemyLabs, min: 3 }] }, [guardDroneDefend, guardDronePromote]);

//Feral Zombies, steal gems, decay on their own
var zombieDecay = new action(`Decay`, { auto: true, partial:true }, [new polyCoefs({subFrom:zombies,b:.1,ceil:true})]);
var zombieRaid = new action(`Raid`, { auto: true, partial:true}, [new polyCoefs({subFrom:gems,b:.25,ceil:false,floor:true})]);
var zombiesRes = new Resource(zombies, {}, [zombieRaid,zombieDecay]);

//Soul Gems, passive mana generators, secretly summon feral zombies
var gemsGlow = new action(`Glow`, { auto: true }, [new polyCoefs({addTo:mana, b:.01}), new polyCoefs({ addTo: zombies, chance: .15, ceil:true, b: 2 })]);
var gemsRes = new Resource(gems, {}, [gemsGlow]);

//Brood Mother, creates basilisks
var broodMotherBirth = new action(`Birth`, { auto: true }, [cost(bloom, lin(0, { c: 0 })), gain(vipers, lin(0, { c: 0 }))]);
var broodMotherPromote = new action(`Promote`, { activationDelay: lowSecDelay() }, [cost(mana, exp(3)), cost(venom, exp(1)), cost(goldDust, exp(1)), cost(vipers, lin(0), bestiary), gain(broodMother, lin(0, {c:-3}), bestiary)]);
var broodMotherRes = new Resource(broodMother, { vizRequirements: [{ id: vipers, min: 1 }] }, [broodMotherBirth, broodMotherPromote]);

//Gold Mill, gold dust automation
var goldMillGrind = new action(`Grind`, { auto: true }, [cost(goldenGrain, lin(0, { c: 0 })), gain(goldDust, lin(0, { c: 0 }))]);
var goldMillUpgrade = new action(`Upgrade`, { activationDelay: medSecDelay() },
 [cost(mana, exp(3)), cost(goldDust, exp(1)), cost(fairyDust, exp(1)), gain(goldMill, flat())]);
var goldMilldRes = new Resource(goldMill, { vizRequirements: [{ id: goldenGrain, min: 1 }] }, [goldMillGrind, goldMillUpgrade]);

//Schools of magic 

//Spells!
var cleanseCast = new action(`Cast`, { activationDelay: medSecDelay(elementalism) }, [cost(mana, exp(0), elementalism), new polyCoefs({ subFrom: zombies, c: 1, repeat: new polyCoefs({ b: 1, scaleBy: elementalism }) })]);
var cleanseRes = new Resource(cleanse, { vizRequirements: [{ id: elementalism, min: 7 }] }, [cleanseCast]);

var controlWeatherCast = new action(`Cast`, { auto: false, activationDelay: medSecDelay() }, [cost(mana, exp(2)), cost(bloom, exp(1)), gain(controlWeather, flat())]);
var controlWeatherRes = new Resource(controlWeather, { vizRequirements: [{ id: elementalism, min: 5 }, { id: fertilizer, min: 1 }] }, [controlWeatherCast]);

var chimeraWork = new action(`Work`, { auto: true },
  [gain(homonculi, lin(0, { c: 0 })), gain(magicBeans, lin(0, { c: 0 })), gain(bloom, lin(0, { c: 0 })),
  cost(wildflowers, lin(0, { c: 0 })), cost(mandragora, lin(0, { c: 0 })), cost(mana, lin(2,{c:0}))]);
var chimeraSplice = new action(`Splice`, { activationDelay: medSecDelay(bloodMagic) }, [cost(mana, exp(4)), cost(homonculi, lin(0), bloodMagic), gain(chimeras, lin(0,{c:-4}), bloodMagic)]);
var chimerasRes = new Resource(chimeras, { vizRequirements: [{ id: bloodMagic, min: 5 }] }, [chimeraWork, chimeraSplice]);


var villagerRes = new Resource(villager, { vizRequirements: [] }, []);
var trustRes = new Resource(trust, { vizRequirements: [] }, []);
var mushroomsRes = new Resource(mushrooms, { vizRequirements: [] }, []);
