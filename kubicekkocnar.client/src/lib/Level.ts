import LevelType from "../types/Level"

interface LevelOptions {
    name?: string
}

const endpoint = "https://localhost:7097/api/Levels"
class Level {
    isClientOnly: boolean = false

    levelId: number;
    name!: string;
    description?: string;
    nextLevel?: number;

    constructor(levelId: number, isClientOnly: boolean, options?: LevelOptions) {
        this.levelId = levelId
        if (isClientOnly) this.name = options?.name ? options?.name : 'New Level'
        else {
            this.initializeServerLevel();
        }
    }

    async initializeServerLevel() {
        try {
            const levelResponse = await fetch(`${endpoint}/${this.levelId}`)
            if (!levelResponse.ok) {
                throw new Error(`Response status: ${levelResponse.status}`);
            }
            const level: LevelType = await levelResponse.json();
            
            this.name = level.name;
            this.description = level.description;
            this.nextLevel = level.nextLevel;

            return level
        } catch (err: any) {
            throw err;
        }
    }

    async save() {
        try {
            const levelResponse = await fetch(`${endpoint}/${this.levelId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: this.name,
                    description: this.description,
                    nextLevel: this.nextLevel
                })
            })
            if (!levelResponse.ok) {
                throw new Error(`Response status: ${levelResponse.status}`);
            }
            const level: LevelType = await levelResponse.json();
            
            this.name = level.name;
            this.description = level.description;
            this.nextLevel = level.nextLevel;

            return level
        } catch (err: any) {
            throw err;
        }
    }
}

export default Level