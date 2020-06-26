import { setTimeout } from "../Utils"

/**
 * This class represents an entity that needs to be synced with multiple players.
 * We will share the entity's information in two ways. First, we will share the full state of the entity with players that just loaded/entered
 * the scene. Then, we will share every individual change that happens afterwards. We will identity each change with an id and a value.
 */
export abstract class MultiplayerEntity<ChangeIdentifier, ChangeValue, FullState> extends Entity {

    /** The entity type should be unique to each class that extends this one. */
    constructor(private readonly entityType: string) {
        super()
        engine.addEntity(this)

        // Register to answer anyone who asks about the full entity state
        messageBus.on(this.messageName(FULL_STATE_REQUEST), (_, sender) => {
            if (sender !== 'self') {
                const fullState = this.getFullStateToShare()
                if (fullState) {
                    messageBus.emit(this.messageName(FULL_STATE_RESPONSE), { fullState })
                }
            }
        })

        // Listen to individual changes
        messageBus.on(this.messageName(CHANGE_OCURRED), ( { changeIdentifier, changeValue }, sender) => {
            if (sender !== 'self') {
                this.onChange(changeIdentifier, changeValue)
            }
        })
    }

    /**
     * Start loading the entity. This is useful if the entity takes a lot to load. On this step,
     * you can start part of the loading process. Take into account that the entity will become visible at another time.
     */
    public startLoading(): void {
        this.ifNotHappenedAlready('loading', () => this.runInitialLoad())
    }

    /**
     * Call this when the user executes a change on the entity locally. The entity will be updated and
     * the change will be informed to the other players
     */
    public changeEntity(changeIdentifier: ChangeIdentifier, changeValue: ChangeValue) {
        messageBus.emit(this.messageName(CHANGE_OCURRED), { changeIdentifier, changeValue })
        this.onChange(changeIdentifier, changeValue)
    }

    /**
     * Start syncing with other players on the scene. We will ask other players on the scene for the full state.
     * If no response is received after a while, we will start the entity with the default values.
     */
    public startSyncing(): void {
        this.ifNotHappenedAlready('syncing', () => {
            let alreadyInitialized = false

            // Prepare for answer
            messageBus.on(this.messageName(FULL_STATE_RESPONSE), ({ fullState }) => {
                if (!alreadyInitialized) {
                    alreadyInitialized = true
                    this.initializeWithFullState(fullState)
                }
            })

            // Ask for the entity's full state
            messageBus.emit(this.messageName(FULL_STATE_REQUEST), { })

            // Set fallback. If got no response in a few seconds, then start with default
            setTimeout(2000, () => {
                if (!alreadyInitialized) {
                    alreadyInitialized = true
                    this.initializeWithFullState(this.getFullStateDefaults())
                }
            })
        })
    }

    /** Show the entity */
    public show(): void {
        this.ifNotHappenedAlready('visible', () => this.setAsVisible())
    }

    /** Return the full state so that it can be shared with users that just entered the scene */
    public abstract getFullStateToShare(): FullState | undefined
    /** Executed first, to start initializing all entity's children. It's not expected to be shown already */
    protected abstract runInitialLoad(): void
    /** If there is no other players on the scene, then start the entity with some default settings */
    protected abstract getFullStateDefaults(): FullState
    /** When we get a full state, we should update the entity accordingly */
    protected abstract initializeWithFullState(fullState: FullState): void
    /** When a change happens, we should update the entity accordingly */
    protected abstract onChange(changeIdentifier: ChangeIdentifier, changeValue: ChangeValue): void
    /** Set the entity as visible */
    protected abstract setAsVisible(): void

    private messageName(messageType: string): string {
        return `${messageType}-${this.entityType}`
    }

    private ifNotHappenedAlready(propertyName: string, action: () => void) {
        if (!this[propertyName]) {
            this[propertyName] = true
            action()
        }
    }
}

const FULL_STATE_REQUEST = 'fullStateRequest'
const FULL_STATE_RESPONSE = 'fullStateResponse'
const CHANGE_OCURRED = 'change'
const messageBus = new MessageBus()
