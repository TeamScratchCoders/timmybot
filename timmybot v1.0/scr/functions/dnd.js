const { log, error } = require('console');
const { ModalBuilder } = require('discord.js');
const fs = require('fs');
const { type } = require('os');
const path = require('path');
const races = [
    "highElf",
    "hillDwarf",
    "human",
    "lightfootHalfling",
    "mountainDwarf",
    "stoutHalfling",
    "woodElf"
]
const classes = [
    "cleric",
    "fighter",
    "rogue",
    "wizard"
]
const backgrounds = [
    "acolyte",
    "criminal",
    "folkHero",
    "noble",
    "sage",
    "soldier"
]
let promptEquipmentIndex = 1

function loadJsonFiles(dirPath) {
    const result = {};

    try {
        // Read all files in the directory
        const files = fs.readdirSync(dirPath);

        files.forEach(file => {
            const filePath = path.join(dirPath, file);
            const fileExt = path.extname(file);

            // Ensure the file is a JSON file
            if (fileExt === '.json') {
                const fileName = path.basename(file, fileExt);

                // Read and parse the JSON file
                const fileContent = fs.readFileSync(filePath, 'utf8');
                result[fileName] = JSON.parse(fileContent);
            }
        });
    } catch (error) {
        console.error(`Error reading JSON files: ${error.message}`);
    }

    return result;
}


const dnd = {
    test: (i) => { //TODO remove
        i.reply({ content: "", embeds: [{ description: "# Create Character\nWould you like to create a D&D character for this campaign?" }], components: [{ type: 1, components: [{ type: 2, style: 3, label: "Yes", custom_id: "dndCreateCharacterYes" }, { type: 2, style: 4, label: "No", custom_id: "dndCreateCharacterNo" }] }] })
    },
    characterCreator: (i) => {
        let raceIndex
        let classIndex
        let backgroundIndex
        try {
            raceIndex = parseInt(i.message.components[0].components[1].data.custom_id[7])
            classIndex = parseInt(i.message.components[0].components[1].data.custom_id[8])
            backgroundIndex = parseInt(i.message.components[0].components[1].data.custom_id[13])
        } catch (err) { }
        const armorData = JSON.parse(fs.readFileSync(`timmybot v1.0/assets/dnd/equipment/armor.json`, 'utf8'))
        const weaponData = JSON.parse(fs.readFileSync(`timmybot v1.0/assets/dnd/equipment/weapons.json`, 'utf8'))
        const equipmentData = { ...armorData, ...weaponData }
        const raceData = JSON.parse(fs.readFileSync(`timmybot v1.0/assets/dnd/races/race.json`, 'utf8'))
        const classData = JSON.parse(fs.readFileSync(`timmybot v1.0/assets/dnd/classes/class.json`, 'utf8'))
        const racesDir = loadJsonFiles("timmybot v1.0/assets/dnd/races/messages");
        const classDir = loadJsonFiles("timmybot v1.0/assets/dnd/classes/messages");
        const backgroundDir = loadJsonFiles("timmybot v1.0/assets/dnd/background/messages");
        const abilityScoreDir = loadJsonFiles("timmybot v1.0/assets/dnd/abilityScorse/messages");
        const alignment = loadJsonFiles("timmybot v1.0/assets/dnd/alignment/messages");
        let userCharacter
        if (fs.existsSync(`timmybot v1.0/assets/dnd/characters/${i.user.id}.json`)) {
            userCharacter = JSON.parse(fs.readFileSync(`timmybot v1.0/assets/dnd/characters/${i.user.id}.json`, 'utf8'))
        } else {
            userCharacter = JSON.parse(fs.readFileSync(`timmybot v1.0/assets/dnd/characters/example.json`, 'utf8'))
        }

        function wrightToCharacter(value, userId, key) {
            userCharacter[key] = value

            fs.writeFileSync(`timmybot v1.0/assets/dnd/characters/${userId}.json`, JSON.stringify(userCharacter, null, 2))
        }
        function generateAbilityScoreMessage() {
            let output = abilityScoreDir.abilityScorse;
            const race = JSON.parse(fs.readFileSync(`timmybot v1.0/assets/dnd/races/race.json`, 'utf8'))[(JSON.parse(fs.readFileSync(`timmybot v1.0/assets/dnd/characters/${i.user.id}.json`, 'utf8'))).race]


            function modAbilityScore(regex, number) {
                output.embeds[0].fields[number].value = output.embeds[0].fields[number].value.replace(regex, ` ${userCharacter.abilityScores[number] + race.abilityScore[number]} `);
            }
            function removeFieldsOutRange(input) {
                output.components[0].components[0].options = output.components[0].components[0].options.filter(option => {
                    return !(option.value === input);
                });
            }

            modAbilityScore(/%strength%/g, 0);
            modAbilityScore(/%dexterity%/g, 1);
            modAbilityScore(/%constitution%/g, 2);
            modAbilityScore(/%intelligence%/g, 3);
            modAbilityScore(/%wisdom%/g, 4);
            modAbilityScore(/%charisma%/g, 5);
            output.embeds[0].description = output.embeds[0].description.replace(/%pointsLeft%/g, `${72 - (userCharacter.abilityScores.reduce((accumulator, currentValue) => accumulator + currentValue, 0))}`);

            if (userCharacter.abilityScores[0] >= 20) {
                removeFieldsOutRange("dndAbilityScoreStrengthIncrease");
            } else if (userCharacter.abilityScores[0] <= 1) {
                removeFieldsOutRange("dndAbilityScoreStrengthDecrease");
            }
            if (userCharacter.abilityScores[1] >= 20) {
                removeFieldsOutRange("dndAbilityScoreDexterityIncrease");
            } else if (userCharacter.abilityScores[1] <= 1) {
                removeFieldsOutRange("dndAbilityScoreDexterityDecrease");
            }
            if (userCharacter.abilityScores[2] >= 20) {
                removeFieldsOutRange("dndAbilityScoreConstitutionIncrease");
            } else if (userCharacter.abilityScores[2] <= 1) {
                removeFieldsOutRange("dndAbilityScoreConstitutionDecrease");
            }
            if (userCharacter.abilityScores[3] >= 20) {
                removeFieldsOutRange("dndAbilityScoreIntelligenceIncrease");
            } else if (userCharacter.abilityScores[3] <= 1) {
                removeFieldsOutRange("dndAbilityScoreIntelligenceDecrease");
            }
            if (userCharacter.abilityScores[4] >= 20) {
                removeFieldsOutRange("dndAbilityScoreWisdomIncrease");
            } else if (userCharacter.abilityScores[4] <= 1) {
                removeFieldsOutRange("dndAbilityScoreWisdomDecrease");
            }
            if (userCharacter.abilityScores[5] >= 20) {
                removeFieldsOutRange("dndAbilityScoreCharismaIncrease");
            } else if (userCharacter.abilityScores[5] <= 1) {
                removeFieldsOutRange("dndAbilityScoreCharismaDecrease");
            }

            return output;
        }
        function racesMessage(i) {
            if (i.customId === "dndRaceNext") {
                if (races.length - 1 > raceIndex) {
                    i.update(racesDir[races[raceIndex + 1]])
                } else {
                    i.update(racesDir[races[0]])
                }
            } else if (i.customId === "dndRacePrevious") {
                if (raceIndex > 0) {
                    i.update(racesDir[races[raceIndex - 1]])
                } else {
                    i.update(racesDir[races[races.length - 1]])
                }
            }

            if (/dndRace[0-9]/g.test(i.customId)) {
                wrightToCharacter(races[raceIndex], i.user.id, "race")
                i.update(classDir[classes[0]])
            }
        }
        function classesMessage(i) {
            if (i.customId === "dndClassNext") {
                if (classes.length - 1 > classIndex) {
                    i.update(classDir[classes[classIndex + 1]])
                } else {
                    i.update(classDir[classes[0]])
                }

            } else if (i.customId === "dndClassPrevious") {
                if (classIndex > 0) {
                    i.update(classDir[classes[classIndex - 1]])
                } else {
                    i.update(classDir[classes[classes.length - 1]])
                }
            }

            if (/dndClass[0-9]/g.test(i.customId)) {
                wrightToCharacter(classes[classIndex], i.user.id, "class")
                i.update(backgroundDir[backgrounds[0]])
            }
        }
        function BackgroundMessage(i) {
            if (i.customId === "dndBackgroundNext") {
                if (backgrounds.length - 1 > backgroundIndex) {
                    i.update(backgroundDir[backgrounds[backgroundIndex + 1]])
                } else {
                    i.update(backgroundDir[backgrounds[0]])
                }
            } else if (i.customId === "dndBackgroundPrevious") {
                if (backgroundIndex > 0) {
                    i.update(backgroundDir[backgrounds[backgroundIndex - 1]])
                } else {
                    i.update(backgroundDir[backgrounds[backgrounds.length - 1]])
                }
            }

            if (/dndBackground[0-9]/g.test(i.customId)) {
                wrightToCharacter(backgrounds[backgroundIndex], i.user.id, "background")
                i.update(generateAbilityScoreMessage(i.user.id))
            }
        }
        function abilityScoreMessage(i) {
            if (i.values[0] === "dndAbilityScoreStrengthIncrease") {
                userCharacter.abilityScores[0] += 1
            } else if (i.values[0] === "dndAbilityScoreStrengthDecrease") {
                userCharacter.abilityScores[0] -= 1
            } else if (i.values[0] === "dndAbilityScoreDexterityIncrease") {
                userCharacter.abilityScores[1] += 1
            } else if (i.values[0] === "dndAbilityScoreDexterityDecrease") {
                userCharacter.abilityScores[1] -= 1
            } else if (i.values[0] === "dndAbilityScoreConstitutionIncrease") {
                userCharacter.abilityScores[2] += 1
            } else if (i.values[0] === "dndAbilityScoreConstitutionDecrease") {
                userCharacter.abilityScores[2] -= 1
            } else if (i.values[0] === "dndAbilityScoreIntelligenceIncrease") {
                userCharacter.abilityScores[3] += 1
            } else if (i.values[0] === "dndAbilityScoreIntelligenceDecrease") {
                userCharacter.abilityScores[3] -= 1
            } else if (i.values[0] === "dndAbilityScoreWisdomIncrease") {
                userCharacter.abilityScores[4] += 1
            } else if (i.values[0] === "dndAbilityScoreWisdomDecrease") {
                userCharacter.abilityScores[4] -= 1
            } else if (i.values[0] === "dndAbilityScoreCharismaIncrease") {
                userCharacter.abilityScores[5] += 1
            } else if (i.values[0] === "dndAbilityScoreCharismaDecrease") {
                userCharacter.abilityScores[5] -= 1
            }


            fs.writeFileSync(`timmybot v1.0/assets/dnd/characters/${i.user.id}.json`, JSON.stringify(userCharacter, null, 2))


            if (!((72 - (userCharacter.abilityScores.reduce((accumulator, currentValue) => accumulator + currentValue, 0))) <= 0)) {
                i.update(generateAbilityScoreMessage())
            } else {
                const ClassSkillProficiency = (JSON.parse(fs.readFileSync(`timmybot v1.0/assets/dnd/classes/class.json`, 'utf8')))[userCharacter.class].proficiency.skills
                const ClassSkillProficiencyNumber = (JSON.parse(fs.readFileSync(`timmybot v1.0/assets/dnd/classes/class.json`, 'utf8')))[userCharacter.class].proficiency.numberOfSkills
                let skillsOptions = [];
                ClassSkillProficiency.forEach(e => {
                    skillsOptions = [...skillsOptions, { label: e, value: e }]
                })

                const skillsMessage = new ActionRowBuilder()
                    .addComponents(
                        new StringSelectMenuBuilder()
                            .setCustomId("dndSkills")
                            .setPlaceholder("Select your skills")
                            .addOptions(skillsOptions)
                            .setMinValues(ClassSkillProficiencyNumber)
                            .setMaxValues(ClassSkillProficiencyNumber)
                    )
                i.update({
                    embeds: [
                        {
                            description: "# Choose Your Skills\n\nSkills represent your character’s expertise in tasks like sneaking, persuading, or identifying magic. Each skill is tied to an ability score. Proficiency in a skill lets you add your proficiency bonus, making you better at related tasks. Pick skills that match your character’s strengths, backstory, and role in the party.",
                        }
                    ],
                    components: [skillsMessage]
                });
            }

        }
        function skillsMessage(i) {
            wrightToCharacter(i.values, i.user.id, "skillProficiency")
            i.update(alignment.alignment)
        }
        function alignmentMessage(i) {
            wrightToCharacter(i.values[0], i.user.id, "alignment")

            const modal = new ModalBuilder()
                .setCustomId('dndModal')
                .setTitle('Personality');

            const name = new TextInputBuilder()
                .setCustomId('name')
                .setLabel('Name:')
                .setStyle(TextInputStyle.Short)
                .setRequired(true);

            const personalityTraits = new TextInputBuilder()
                .setCustomId('personalityTraits')
                .setLabel('Personality Traits:')
                .setStyle(TextInputStyle.Paragraph)
                .setRequired(true);

            const ideals = new TextInputBuilder()
                .setCustomId('ideals')
                .setLabel('Ideals:')
                .setStyle(TextInputStyle.Paragraph)
                .setRequired(true);

            const bonds = new TextInputBuilder()
                .setCustomId('bonds')
                .setLabel('Bonds:')
                .setStyle(TextInputStyle.Paragraph)
                .setRequired(true);

            const flaws = new TextInputBuilder()
                .setCustomId('flaws')
                .setLabel('Flaws:')
                .setStyle(TextInputStyle.Paragraph)
                .setRequired(true);

            const nameRow = new ActionRowBuilder().addComponents(name);
            const personalityTraitsRow = new ActionRowBuilder().addComponents(personalityTraits);
            const idealsRow = new ActionRowBuilder().addComponents(ideals);
            const bondsRow = new ActionRowBuilder().addComponents(bonds);
            const flawsRow = new ActionRowBuilder().addComponents(flaws);

            modal.addComponents(nameRow, personalityTraitsRow, idealsRow, bondsRow, flawsRow);
            i.showModal(modal)
        }
        function processPersonalityModal(i) {
            wrightToCharacter(i.components[0].components[0].value, i.user.id, "name")
            wrightToCharacter(i.components[1].components[0].value, i.user.id, "personalityTraits")
            wrightToCharacter(i.components[2].components[0].value, i.user.id, "ideals")
            wrightToCharacter(i.components[3].components[0].value, i.user.id, "bonds")
            wrightToCharacter(i.components[4].components[0].value, i.user.id, "flaws")
        }
        function processWeaponProficiency(i) {
            const raceWeapons = raceData[userCharacter.race].proficiency.weapons
            const raceWeaponsFiltered = raceWeapons.filter(e => e !== "simpleWeapon" && e !== "marshallWeapon")

            const classWeapons = classData[userCharacter.class].proficiency.weapons
            const classWeaponsFiltered = classWeapons.filter(e => e !== "simpleWeapon" && e !== "marshallWeapon")


            if (raceWeapons.includes("simpleWeapon")) {
                wrightToCharacter([...userCharacter.weaponProficiency, ...weaponData.simpleWeapon,], i.user.id, "weaponProficiency")
            }
            if (raceWeapons.includes("marshallWeapon")) {
                wrightToCharacter([...userCharacter.weaponProficiency, ...weaponData.marshallWeapon], i.user.id, "weaponProficiency")
            }
            if (classWeapons.includes("simpleWeapon")) {
                wrightToCharacter([...userCharacter.weaponProficiency, ...weaponData.simpleWeapon], i.user.id, "weaponProficiency")
            }
            if (classWeapons.includes("marshallWeapon")) {
                wrightToCharacter([...userCharacter.weaponProficiency, ...weaponData.marshallWeapon], i.user.id, "weaponProficiency")
            }

            if (raceWeapons.length <= 1) {
                wrightToCharacter([...new Set([...userCharacter.weaponProficiency, ...raceWeaponsFiltered])], i.user.id, "weaponProficiency");
            }

        }
        function processArmorProficiency(i) {
            const raceArmor = raceData[userCharacter.race].proficiency.armor
            const classArmor = classData[userCharacter.class].proficiency.armor

            if (raceArmor.includes("lightArmor")) {
                wrightToCharacter([...userCharacter.armorProficiency, ...armorData.lightArmor], i.user.id, "armorProficiency");
            }
            if (raceArmor.includes("mediumArmor")) {
                wrightToCharacter([...userCharacter.armorProficiency, ...armorData.mediumArmor], i.user.id, "armorProficiency");
            }
            if (raceArmor.includes("heavyArmor")) {
                wrightToCharacter([...userCharacter.armorProficiency, ...armorData.heavyArmor], i.user.id, "armorProficiency");
            }
            if (classArmor.includes("lightArmor")) {
                wrightToCharacter([...userCharacter.armorProficiency, ...armorData.lightArmor], i.user.id, "armorProficiency");
            }
            if (classArmor.includes("mediumArmor")) {
                wrightToCharacter([...userCharacter.armorProficiency, ...armorData.mediumArmor], i.user.id, "armorProficiency");
            }
            if (classArmor.includes("heavyArmor")) {
                wrightToCharacter([...userCharacter.armorProficiency, ...armorData.heavyArmor], i.user.id, "armorProficiency");
            }
        }
        function promptEquipment(user, classQuestionIndex) {//*Generates a dynamic message based off of the equipment the user can choose
            let fields = []
            let selectorMenuOptions = []
            filterChoices(classData[userCharacter.class].questions[classQuestionIndex])

            function filterChoices(choicesObj) {//* This breaks up an choice and processes it.
                function futureChoiceIsPresentable(index) {
                    if (choicesObj.choices[index + 1] == undefined) {
                        return false
                    }

                    const futureItems = choicesObj.choices[index + 1].items

                    const futureItemsRequiresProficiency = !(futureItems.reduce((acc, item) => acc.concat(item.requiresProficiency), []).includes(false))// Compiles an array of all items that require proficiency

                    let futureChoiceOutput = []
                    if (futureItemsRequiresProficiency) {// If all items require proficiency to use then this checks to see if the user is proficient
                        futureItems
                            .forEach(item => {
                                futureChoiceOutput.push(isProficient(item))
                            })
                    } else {
                        futureChoiceOutput.push(true)
                    }
                    return futureChoiceOutput.includes(true)
                }
                let index = []
                for (let i = 0; i < (choicesObj.numberOfChoices + 1); i++) {// Runs for every choice
                    choicesObj.choices[i].items// Runs for every item in one choice
                        .forEach(item => {
                            if (item.requiresProficiency) {// This outputs all items that are qualified to be shown to the user
                                if (isProficient(item)) {
                                    generateField(item)
                                    index.push("field")
                                }
                            } else {
                                generateField(item)
                                index.push("field")
                            }
                        })

                    constructMenuOption(choicesObj.choices[i])
                    if (futureChoiceIsPresentable(i)) {//  Checks to see if the next item is going to included
                        if (index[index.length - 1] == "field") {// If the last object in the array is not an divider.
                            generateDivider()
                            index.push("divider")
                        }
                    }
                }
                wrightToCharacter(classData[userCharacter.class].questions.length, user.user.id, "equipmentProgressMax")
                if (index.length <= 1) {
                    wrightToCharacter(classQuestionIndex + 1, user.user.id, "equipmentProgress")
                    promptEquipment(user, classQuestionIndex + 1)
                    return
                }
                wrightToCharacter(classQuestionIndex, user.user.id, "equipmentProgress")
                const embed1 = new EmbedBuilder()
                    .setDescription("# Choose your Equipmen\n\nEquipment in D&D defines your character's survival and abilities. Weapons, armor, and gear impact combat, defense, and problem-solving. Choosing wisely ensures readiness for any challenge.")
                    .setColor(0)

                const embed2 = new EmbedBuilder()
                    .setColor(2686976)
                    .addFields(fields)

                user.update({
                    embeds: [embed1, embed2],
                    components: [
                        constructActionRow(constructSelectorMenu())
                    ]
                })
            }

            function isProficient(itemObj) {//* This checks an item for proficiency
                if (itemObj != undefined) {
                    if (itemObj.requiresProficiency) {
                        return userCharacter.weaponProficiency.includes(itemObj.id)
                    }
                    return true
                }
                return false
            }

            function generateField(itemObj) {//* This generates the field

                const equipmentObj = equipmentData[itemObj.id]
                if (equipmentObj.type == "weapon") {
                    compilerFields({
                        name: `${itemObj.quantity > 1 ? `${itemObj.quantity} ` : ``}${equipmentObj.name}${itemObj.quantity > 1 ? `s` : ``}`,
                        value: `${equipmentObj.description}\n\n**DAMAGE:** ${equipmentObj.damageMultiplier}d${equipmentObj.damage}\n**DAMAGE TYPE:** ${equipmentObj.damageType}${equipmentObj.properties.length > 0 ? `\n**WEIGHT:** ${equipmentObj.weight} lbs\n**PROPERTIES:** ${equipmentObj.properties.reduce((acc, item, index) => acc += `${item}${equipmentObj.properties.length - 1 == index ? `` : `, `}`, ``)}` : ``}${equipmentObj.rang > 0 ? `\n**RANGE:** ${equipmentObj.rang}/${equipmentObj.longRange}` : ``}${equipmentObj.versatile > 0 ? `\n**VERSATILE:**${equipmentObj.versatileMultiplier}d${equipmentObj.versatile}` : ``}`,
                        inline: true
                    })
                } else if (equipmentObj.type == "armor") {
                    compilerFields({
                        name: `${itemObj.quantity > 1 ? `${itemObj.quantity} ` : ``}${equipmentObj.name}${itemObj.quantity > 1 ? `s` : ``}`,
                        value: `${equipmentObj.description}\n\n**ARMOR CLASS:** ${equipmentObj.armorClass}${equipmentObj.addDexterityModifier ? ` + DEX MODIFIER${equipmentObj.dexterityModifierMax ? `(${equipmentObj.dexterityModifierMax} MAX)` : ``}` : ``}\n**WEIGHT:** ${equipmentObj.weight} lbs${equipmentObj.strength ? `\n**STRENGTH:** ${equipmentObj.strength}` : ``}${equipmentObj.stealthDisadvantage ? `\n**STEALTH DISADVANTAGE:** ✔` : `\n**STEALTH DISADVANTAGE:** ✖`}`,
                        inline: true
                    })
                } else if (itemObj.id == "marshallWeapon") {
                    compilerFields({
                        name: `Marshall Weapon`,
                        value: `A Martial Weapon of your choice`,
                        inline: true
                    })
                } else if (itemObj.id == "simpleWeapon") {
                    compilerFields({
                        name: `Simple Weapon`,
                        value: `A Simple Weapon of your choice`,
                        inline: true
                    })
                }
            }

            function generateDivider() {//* This generates the divider
                compilerFields({
                    name: " ",
                    value: "**-------------------------------------- OR --------------------------------------**",
                    inline: false
                })
            }

            function compilerFields(field) {
                fields.push(field)
            }

            function constructMenuOption(choices) {
                function getName(choices) {
                    return choices.items.reduce((accumulator, item, index) => {
                        if (index != 0 && isProficient(item)) {
                            accumulator += " & "
                        }

                        if (isProficient(item)) {
                            accumulator += `${item.quantity > 1 ? `${item.quantity} ` : ""}${item.displayName}${item.quantity > 1 ? `s` : ""}`
                        }

                        return accumulator
                    }, "")
                }
                function getValue(choices) {
                    return choices.items.reduce((accumulator, item, index) => {
                        if (index != 0) {
                            accumulator += "&"
                        }

                        if (item.requiresProficiency) {
                            if (isProficient(item)) {
                                accumulator += `${item.quantity > 1 ? `${item.quantity}` : ""}${item.id}${item.quantity > 1 ? `s` : ""}`
                            }
                        } else {
                            accumulator += `${item.quantity > 1 ? `${item.quantity}` : ""}${item.id}`
                        }
                        return accumulator
                    }, "")
                }

                if (getName(choices) != "") {
                    selectorMenuOptions.push({
                        label: getName(choices),
                        value: getValue(choices)
                    })
                }
            }

            function constructSelectorMenu() {
                const selectorMenu = new StringSelectMenuBuilder()
                    .setCustomId("dndEquipment")
                    .setPlaceholder("Select Equipment")
                    .addOptions(selectorMenuOptions)

                return selectorMenu
            }

            function constructActionRow(selectorMenu) {
                const actionRow = new ActionRowBuilder()
                    .addComponents(selectorMenu)

                return actionRow
            }
        }

        function chooseWeapon(userValue) {
            if (Array.isArray(userValue) == false) {//! Error handling <--
                console.error("The function chooseWeapon Failed because an array was expected");
                return null
            } else if (userValue.length == 0) {
                console.error("The function chooseWeapon Failed because an empty array was passed");
                return null
            }//! --> Error handling

            try {
                let value = userValue.find(item => item == "marshallWeapon" || item == "simpleWeapon")
                let userValueFiltered = userValue.filter(item => item != value)
                return generateMessage(value)

                //* Functions
                function generateMessage(type) {
                    const weapons = equipmentData[type].map(weaponId => ({
                        label: equipmentData[weaponId].name,
                        value:
                            weaponId + userValueFiltered.reduce((accumulator, item) => accumulator += `&${item}`, "")
                    }));

                    const selectorMenu = new StringSelectMenuBuilder()
                        .setCustomId("dndEquipment")
                        .setPlaceholder(`Select a ${type == "marshallWeapon" ? "Marshall Weapon" : "Simple Weapon"}`)
                        .addOptions(weapons);

                    const actionRow = new ActionRowBuilder()
                        .addComponents(selectorMenu);

                    const embed = new EmbedBuilder()
                        .setTitle(`${type == "marshallWeapon" ? "Marshall Weapon" : "Simple Weapon"}`)
                        .setDescription(`${type == "marshallWeapon" ? "A Martial Weapon of your choice" : "A Simple Weapon of your choice"}`);

                    return {
                        embeds: [embed],
                        components: [actionRow]
                    };
                }
            } catch (err) {
                console.error(err);
            }
        }

        function processEquipmentMessages(user) {
            try {
                let quantityItem = []
                let userValue = user.values// This transforms a menus value into a usable item IDs and quantities
                    .reduce((accumulator, item) => accumulator.concat(item.split("&")), [])
                userValue
                    .map((item, index) => {
                        if (/\d+/.test(item)) {
                            userValue[index] = item.replace(/^\d+/, '');
                            quantityItem.push(parseInt(item.replace(/\D+/, '')));
                        } else {
                            quantityItem.push(1);
                        }
                        return item;
                    });

                if (!(userValue.includes("marshallWeapon") || userValue.includes("simpleWeapon"))) {// This skips Marshall weapons in simple weapons cuz the player must choose what that weapon is so it cannot add it to the players inventory
                    userValue.forEach((item, index) => {
                        let repeatItem = userCharacter.equipment.find(equipment => equipment.id == item)// This is so that duplicate items don't happen
                        if (repeatItem) {
                            repeatItem.quantity += quantityItem[index]
                        } else {
                            userCharacter.equipment.push({ id: item, quantity: 1 })
                        }

                        wrightToCharacter(userCharacter.equipment, user.user.id, "equipment")

                        if ((userCharacter.equipmentProgress + 1) < userCharacter.equipmentProgressMax) {// This iterates through all choices the player can make for equipment
                            user.update(promptEquipment(user, userCharacter.equipmentProgress + 1))// Reruns function
                        } else {
                            console.log("Finished");
                            //TODO: Next question
                            
                            user.update({content: "Finished", embeds: [], components: []})// Finished function
                        }
                    })
                } else {
                    user.update(chooseWeapon(userValue))// This prompts the player to choose a weapon
                }
            } catch (err) {
                error(err)
            }
        }

        if (i.customId === "dndCreateCharacterYes") {
            i.reply(racesDir.highElf)
        } else if (i.customId === "dndCreateCharacterNo") {
            i.message.delete()
        }

        if (/dndRace/.test(i.customId)) {
            racesMessage(i)
        } else if (/dndClass/.test(i.customId)) {
            classesMessage(i)
        } else if (/dndBackground/.test(i.customId)) {
            BackgroundMessage(i)
        } else if (/dndAbilityScore/.test(i.customId)) {
            abilityScoreMessage(i)
        } else if (i.customId === "dndSkills") {
            skillsMessage(i)
        } else if (i.customId === "dndAlignment") {
            alignmentMessage(i)
        } else if (i.customId === "dndModal") {
            promptEquipment(i, 0)
        } else if (i.customId === "dndEquipment") {
            processEquipmentMessages(i)
        }

        //TODO Equipment proficiency
        //TODO equipment

        //TODO skils
        //TODO initiative
        //TODO saving throughs
        //TODO passive wisdom
        //TODO Armor class
        //TODO SPEED
        //TODO Current hit points
        //TODO Hit point maximum
        //TODO Temporary hit points
        //TODO hit dice
        //TODO features and traits
    },
    processInteraction: (i) => {
        dnd.characterCreator(i)
    }
}

module.exports = { dnd }