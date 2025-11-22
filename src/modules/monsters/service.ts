import axios from "axios";
import { Repository } from "./repository";
import { DND_API_BASE_URL } from "../../utils/constants";


export class Service {
  static async importAll() {
    const list = await axios.get(`${DND_API_BASE_URL}/api/monsters`);
    const monsters = list.data.results;

    const inserted = [];

    for (const m of monsters) {
      try {
        const full = await axios.get(`${DND_API_BASE_URL}${m.url}`);
        const monster = full.data;

        let armorClass = null;
        if (Array.isArray(monster.armor_class)) {
          armorClass = monster.armor_class[0]?.value ?? null;
        } else if (typeof monster.armor_class === "number") {
          armorClass = monster.armor_class;
        }

        const data = {
          index: monster.index,
          name: monster.name,
          size: monster.size,
          type: monster.type,
          alignment: monster.alignment,
          armor_class: armorClass,
          hit_points: monster.hit_points,
          hit_dice: monster.hit_dice,
          speed: monster.speed || {},
          strength: monster.strength,
          dexterity: monster.dexterity,
          constitution: monster.constitution,
          intelligence: monster.intelligence,
          wisdom: monster.wisdom,
          charisma: monster.charisma,
          proficiencies: monster.proficiencies || [],
          damage_vulnerabilities: monster.damage_vulnerabilities || [],
          damage_resistances: monster.damage_resistances || [],
          damage_immunities: monster.damage_immunities || [],
          condition_immunities: monster.condition_immunities || [],
          senses: monster.senses || {},
          languages: monster.languages || null,
          challenge_rating: monster.challenge_rating,
          proficiency_bonus: monster.proficiency_bonus,
          xp: monster.xp,
          special_abilities: monster.special_abilities || [],
          actions: monster.actions || [],
          legendary_actions: monster.legendary_actions || [],
          reactions: monster.reactions || [],
          image: monster.image || null,
        };

        const result = await Repository.insert(data);
        inserted.push(result);
      } catch (err) {
        console.log("Error importing", m.index);
      }
    }

    return { imported: inserted.length };
  }
}
