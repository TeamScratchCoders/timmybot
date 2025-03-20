const fs = require('fs')
const { role } = require('./role.js')
const { client } = require('../main.js')
const { GuildMember } = require('discord.js');
const { error } = require('console');
const verifiedMembersPath = 'timmybot v1.0/assets/verirfication/verifiedMembers.json'
let verifiedMembers = JSON.parse(fs.readFileSync(verifiedMembersPath, 'utf8'))

const verification = {
    // checkUserVerification: async function(i) {
    //     try {
    //         let verificationStatus
    //         if (verifiedMembers.members.includes(i.user.id)) {
    //             await i.send('It looks like you enabled direct messaging :rage:. Direct messaging is against our rules please re-enable it to gain access to the server. You will have to reverify.')
    //                 .then(verificationStatus = false)
    //                 .catch((e) => e.rawError.code == 50007? verificationStatus = true : verificationStatus = false);
    //         } else {
    //             await i.send('Looks like there was an issue. Please try following the instructions again or if you need help try the <#1223885441787236423> channel. :grinning:')
    //                 .then(verificationStatus = false)
    //                 .catch((e) => e.rawError.code == 50007 ? verificationStatus = true : verificationStatus = false);
    //         }

    //         return verificationStatus

    //     } catch (err) {
    //         if (err.message === 'Cannot send messages to this user') {
    //             if (verifiedMembers.members.includes(i.user.id)) {
    //                 console.log(false);
    //                 return false
    //             } else {
    //                 return true
    //             }
    //         } else {
    //             console.log(err);
    //         }
    //     }
    // },
    // ceckUserVerificationID: async (i) => {
    //     try {
    //         if (verifiedMembers.members.includes(i)) {
    //             await client.users.fetch(i).then(user => user.send('It looks like you enabled direct messaging :rage:. Direct messaging is against our rules please re-enable it to gain access to the server. You will have to reverify.'));
    //         } else {
    //             await client.users.fetch(i).then(user => user.send('Looks like there was an issue. Please try following the instructions again or if you need help try the <#1223885441787236423> channel. :grinning:'));
    //         }
    //         return false
    //     } catch (err) {
    //         if (err.message === 'Cannot send messages to this user') {
    //                 return true
    //         } else {
    //             console.log(err);
    //         }
    //     }
    // },
    // verifyUser: async function(i) {
    //     try {
    //         if (verifiedMembers.members.includes(i.user.id)) {
    //             await client.users.fetch(i.user.id).then(user => user.send('It looks like you enabled direct messaging :rage:. Direct messaging is against our rules please re-enable it to gain access to the server. You will have to reverify.'));
    //         } else {
    //             await client.users.fetch(i.user.id).then(user => user.send('Looks like there was an issue. Please try following the instructions again or if you need help try the <#1223885441787236423> channel. :grinning:'));
    //         }
    //         return false
    //     } catch (err) {
    //         if (err.message === 'Cannot send messages to this user') {
    //             if (!(verifiedMembers.members.includes(i.user.id))) {
    //                try {
    //                     verifiedMembers.members.push(i.user.id)
    //                     fs.writeFileSync('timmybot v1.0/assets/verirfication/verifiedMembers.json', JSON.stringify(verifiedMembers, null, 2))
    //                 } catch (err) {
    //                     console.log(err);
    //                 }
    //             }
                
    //             return true
    //         } else {
    //             console.log(err);
    //             return false
    //         }
    //     }
    // },
    // verifyUserByID: async (id) => {
    //     console.log(id)
    //     try {
    //         if (verifiedMembers.members.includes(id)) {
    //             await client.users.fetch(id).then(user => user.send('It looks like you enabled direct messaging :rage:. Direct messaging is against our rules please re-enable it to gain access to the server. You will have to reverify.'));
    //         } else {
    //             await client.users.fetch(id).then(user => user.send('Looks like there was an issue. Please try following the instructions again or if you need help try the <#1223885441787236423> channel. :grinning:'));
    //         }
    //         return false
    //     } catch (err) {
    //         if (err.message === 'Cannot send messages to this user') {
    //             if (!(verifiedMembers.members.includes(id))) {
    //                 verifiedMembers.members.push(id)
    //                 fs.writeFileSync('timmybot v1.0/assets/verirfication/verifiedMembers.json', JSON.stringify(verifiedMembers, null, 2))
    //             }
                
    //             return true
    //         } else {
    //             console.log(err);
    //             return false
    //         }
    //     }
    // },
    // removeUser: async (i) => {
    //     try {
    //         const removeMembers = verifiedMembers.members.filter(item => item !== i)

    //         await fs.writeFileSync('timmybot v1.0/assets/verirfication/verifiedMembers.json', JSON.stringify({members: removeMembers}, null, 2))
    //     } catch (err) {
    //         console.log(err);
    //     }
    // },
    // scanUsers: async function() {
    //     verifiedMembers = JSON.parse(fs.readFileSync('timmybot v1.0/assets/verirfication/verifiedMembers.json'))
    //     try {
    //         for (let i2 = 1; i2 < verifiedMembers.members.length; i2++) {
    //             const e = verifiedMembers.members[i2]
    //             if (!(await verification.ceckUserVerificationID(e))) {

    //                 await verification.removeUser(e)

    //                 role.unverify(e)
    //             }
    //         }
    //     } catch (err) {
    //         console.log(err);
    //     }
    // }
    /**
     * //TODO: I have to add user to a list of verified users
     * //TODO: I have to remove user from a list of verified users
     * //TODO: I have to have a function to check if user have DM's are disabled
     * TODO: I have kick the user if they enable DM's and remove there roles 
     * TODO: If a user is kicked and they disable DM's I need to add there roles back
     * 
     */

    /**
     * This function adds a user to the list of verified users.
     * @param {import('discord.js').GuildMember} member - The guild member object
     * @throws {Error} If the fs falles to wright.
     */
    verifyUser: (memberObj) => {
        if (!(memberObj instanceof GuildMember)) {
            throw new Error(`Expected memberObj to be a GuildMember object. Received: ${typeof memberObj}`);
        }
        if (!verifiedMembers.members.includes(memberObj.id)) {
            verifiedMembers.members.push(memberObj.id)
            try {
                fs.writeFileSync(verifiedMembersPath, JSON.stringify(verifiedMembers))
            } catch (err) {
                throw new Error(`Faled to write to verifiedMembers.json. Error: ${err}`)
            }
        }
    },
    /**
     * This function removes a user from the list of verified users.
     * @param {import('discord.js').GuildMember} memberObj - The guild member object
     * @throws {Error} If the fs falles to wright.
     */
    unverifyUser: (memberObj) => {
        if (!(memberObj instanceof GuildMember)) {
            throw new Error(`Expected memberObj to be a GuildMember object. Received: ${typeof memberObj}`);
        }
        const removeMembers = verifiedMembers.members.filter(item => item !== memberObj.id)
        verifiedMembers.members = removeMembers;
        try {
            fs.writeFileSync(verifiedMembersPath, JSON.stringify({members: removeMembers}, null, 2))
        } catch (err) {
            throw new Error(`Faled to write to verifiedMembers.json. Error: ${err}`)
        }
    },

    /**
     * This function checks if a user is verified or not
     * @param {import('discord.js').GuildMember} memberObj - The guild member object
     * @returns {boolean} If the user is verified or not
     * @throws {Error} If the memberObj is not a GuildMember object
     */
    getUserVerification: (memberObj) => {
        if (!(memberObj instanceof GuildMember)) {
            throw new Error(`Expected memberObj to be a GuildMember object. Received: ${typeof memberObj}`);
        }
        return verifiedMembers.members.includes(memberObj.id)
    },
    /**
     * Checks if a user can be direct messaged. If the user is able to be direct messaged, then it will return false. If the user is unable to be direct messaged, then it will return true. If the check fails, then it will throw an error.
     * @param {import('discord.js').GuildMember} memberObj - The guild member object
     * @returns {boolean} If the user can be direct messaged or not
     * @throws {Error} If the check fails
     */
    checkUserSecurity: async (memberObj) => {
        if (!(memberObj instanceof GuildMember)) {
            throw new Error(`Expected memberObj to be a GuildMember object. Received: ${typeof memberObj}`);
        }
        let secure
        await memberObj.send("If you are seeing this than that is not good. Go back to the server to get further instructions.")
            .then(secure = false)
            .catch((e) => e.rawError.code === 50007 ? secure = true : secure = null)

        if (secure == null) {
            throw new Error("Failed to run checkUserSecurity function, no information available")
        }
        return secure
    }
}

module.exports = { verification }