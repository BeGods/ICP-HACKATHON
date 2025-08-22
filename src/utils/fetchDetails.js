import characters from "../assets/characters.json"
import relics from "../assets/relics.json"

export const fetchCharDetails = (charId) => {
    const parts = charId.split(".");
    const charMyth = parts[0];
    const charCode = parts[2];
    const atk = characters[charMyth][charCode].atk;
    const def = characters[charMyth][charCode].def;
    const weaponName = characters[charMyth][charCode].weaponName;
    const coinBal = characters[charMyth][charCode].coins;
    const orbBal = {
        type: characters[charMyth][charCode].orbType,
        amount: characters[charMyth][charCode].orbAmt,
    };

    return {
        cardId: `${charMyth}.char.${charCode}`,
        weaponName: weaponName,
        name: characters[charMyth][charCode].name,
        atk: atk,
        def: def,
        coinBal: coinBal,
        orbBal: orbBal,
        myth: charMyth,
    };
};

export const fetchRelicDetails = (relicId) => {
    const parts = relicId.split(".");
    const relicMyth = parts[0];
    const relicCode = parts[2];
    const relicDetails = relics.relics[relicMyth][relicCode];

    return {
        cardId: `${relicMyth}.relics.${relicCode}`,
        name: relicDetails.name,
        myth: relicMyth,
        atk_on: relicDetails.atk_on,
        def_on: relicDetails.def_on,
        atk_off: relicDetails.atk_off,
        def_off: relicDetails.def_off,
        atk_bonus: relicDetails.atk_bonus,
        def_bonus: relicDetails.def_bonus,
        coins: relicDetails.coins,
        orbType: relicDetails.orbType,
        orbAmt: relicDetails.orbAmt,
    };
};


export const handleSignMathOpr = (currentValue, changeStr) => {
    if (typeof changeStr !== "string" || changeStr.length < 2)
        return currentValue;
    const sign = changeStr[0];
    const num = parseInt(changeStr.slice(1), 10) || 0;

    if (sign === "+") return currentValue + num;
    if (sign === "-") return currentValue - num;
    return currentValue;
};
