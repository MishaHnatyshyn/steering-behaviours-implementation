import FallowDeer from "./characters/fallowDeer";
import {getRandIntInRange} from "./utils";
import {FALLOW_DEERS_GROUP_MAX_SIZE, FALLOW_DEERS_GROUP_MIN_SIZE, FIELD_HEIGHT, FIELD_WIDTH} from "../constants";
import Wolf from "./characters/wolf";
import Rabbit from "./characters/rabbit";
import {Characters} from "./characters.enum";
import Hunter from "./characters/hunter";
import Character from "./character";

export default class CharactersGenerator {
    private static CHARACTERS_MAP = {
        [Characters.HUNTER]: Hunter,
        [Characters.RABBIT]: Rabbit,
        [Characters.WOLF]: Wolf,
        [Characters.FALLOW_DEER]: FallowDeer,
    }
    static generateDeersGroup(deersCount: number): FallowDeer[] {
        const deerGroupsCount = CharactersGenerator.getRandomGroupsCount(deersCount)
        let deersLeft = deersCount;
        return new Array(deerGroupsCount).fill(0).map((_, index) => {
            const group = CharactersGenerator.createGroup(index, deersLeft, deerGroupsCount);
            deersLeft -= group.length;
            return group;
        }).flat()
    }

    private static generateCharacter(type: Characters): Character {
        return new CharactersGenerator.CHARACTERS_MAP[type](Math.random() * FIELD_WIDTH, Math.random() * FIELD_HEIGHT)
    }

    private static generateCharactersList(count: number, type: Characters): Character[] {
        return new Array(count).fill(0).map(CharactersGenerator.generateCharacter.bind(null, type))
    }

    static generateWolves(count: number): Wolf[] {
        return CharactersGenerator.generateCharactersList(count, Characters.WOLF) as Wolf[];
    }

    static generateRabbits(count: number): Rabbit[] {
        return CharactersGenerator.generateCharactersList(count, Characters.RABBIT) as Rabbit[];
    }

    static generateHunter(): Hunter {
        return CharactersGenerator.generateCharacter(Characters.HUNTER) as Hunter;
    }

    private static getRandomGroupsCount(deersCount: number): number {
        const minDeerGroupsCount = Math.floor(deersCount / FALLOW_DEERS_GROUP_MAX_SIZE) + 1;
        const maxDeerGroupsCount = Math.floor(deersCount / FALLOW_DEERS_GROUP_MIN_SIZE);
        return  getRandIntInRange(minDeerGroupsCount, maxDeerGroupsCount);
    }

    private static createGroupMember(baseX: number, baseY: number, groupId: number): FallowDeer {
        const x = getRandIntInRange(baseX - 10, baseX + 10);
        const y = getRandIntInRange(baseY - 10, baseY + 10);
        return new FallowDeer(x, y, groupId);
    }

    private static createGroup(groupId: number, deersLeft: number, totalGroups: number): FallowDeer[] {
        const deersInGroup = CharactersGenerator.getRandomDeersCountForGroup(totalGroups, groupId, deersLeft);
        const x = Math.random() * FIELD_WIDTH;
        const y = Math.random() * FIELD_HEIGHT;
        return new Array(deersInGroup)
            .fill(0)
            .map(() => CharactersGenerator.createGroupMember(x, y, groupId))
    }

    private static getRandomDeersCountForGroup(totalGroups: number, groupId: number, deersLeft: number): number {
        const groupsLeft = totalGroups - groupId - 1;
        const maxAvailAbleDeers = deersLeft - FALLOW_DEERS_GROUP_MIN_SIZE * groupsLeft;
        const maxDeersInGroup = Math.min(maxAvailAbleDeers, FALLOW_DEERS_GROUP_MAX_SIZE);
        return  groupId === totalGroups - 1 ? deersLeft : getRandIntInRange(FALLOW_DEERS_GROUP_MIN_SIZE, maxDeersInGroup);
    }
}