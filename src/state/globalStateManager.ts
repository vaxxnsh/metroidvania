export const statePropsEnum = {
    playerHp : "playerHp",
    maxPlayerHp : "maxPlayerHp",
    doubleJumpEnabled : "doubleJumpEnabled",
    isPlayerInBossFight : "isPlayerInBossFight",
    isBossDefeated : "isBossDefeated",
};

function initStateManager() {
    const state = {
        playerHp : 3,
        maxPlayerHp : 3,
        doubleJumpEnabled : false,
        isPlayerInBossFight : false,
        isBossDefeated : false,
    }

    return (
        {
            current(){
                return {...state}
            },

            set(property : string,value : any) {
                state[property] = value
            }


        }
    )
}

export const state = initStateManager()