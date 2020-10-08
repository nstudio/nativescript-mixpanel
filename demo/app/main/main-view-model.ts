import { Observable } from "@nativescript/core/data/observable/observable";
import { setTimeout } from "@nativescript/core/timer";
import {
    NativeScriptMixpanel,
    NativeScriptMixpanelPeople,
} from "@nstudio/nativescript-mixpanel";

import { MIXPANEL_TOKEN } from "~/constants";

export class MainModel extends Observable {
    public token: string = MIXPANEL_TOKEN;
    public testsEnabled: boolean = this.token.length > 0;

    private people?: NativeScriptMixpanelPeople;

    private readonly testProps = {
        "Test Type": "test value",
    };

    constructor() {
        super();

        if (MIXPANEL_TOKEN.length === 0) {
            console.error(
                "No token has been set, please set your token in constants.ts"
            );
        }

        // This token should be set in constants.ts
        NativeScriptMixpanel.init(MIXPANEL_TOKEN);
        console.log(`Mixpanel initialised, token: ${MIXPANEL_TOKEN}`);
    }

    // User Identity
    public onIdentifyPress(): void {
        console.log("Test: Identify");
        NativeScriptMixpanel.identify("test identity");
    }

    public onAliasPress(): void {
        console.log("Test: Alias");
        NativeScriptMixpanel.alias("test alias");
    }

    // Events
    public onRegisterSuperPropertiesPress(): void {
        console.log("Test: Register Super Properties");
        NativeScriptMixpanel.registerSuperProperties(this.testProps);
    }

    public onUnregisterSuperPropertyPress(): void {
        console.log("Test: Unregister Super Property");
        // Register property to remove
        NativeScriptMixpanel.registerSuperProperties({
            "special property": "magical",
        });

        NativeScriptMixpanel.unregisterSuperProperty("special property");
    }

    public onClearPress(): void {
        console.log("Test: Clear Super Properties");
        NativeScriptMixpanel.clearSuperProperties();
    }

    public onTrackPress(): void {
        console.log("Test: Track");
        NativeScriptMixpanel.track("test event", {
            tracking: "this",
        });
    }

    public async onTimeEventPress(): Promise<void> {
        console.log("Test: Time Event: Begin");

        const eventName = "Time Event Test";
        NativeScriptMixpanel.timeEvent(eventName);

        await new Promise((resolve) => setTimeout(resolve, 2000));
        NativeScriptMixpanel.track(eventName);
        console.log("Test: Time Event: Finish");
    }

    // People
    public onPeopleGetPeoplePress(): void {
        console.log("Test: Get People");
        this.people = NativeScriptMixpanel.getPeople();
        if (!this.people) {
            console.error(
                "Failed: 'NativeScriptMixpanel.getPeople()': returned undefined."
            );
        }
    }

    public onPeopleIdentifyPress(): void {
        console.log("Test: People Set Identify");
        if (!this.people) {
            console.error("Please press 'Get People' first.");
            return;
        }
        this.people.identify(MIXPANEL_TOKEN);
    }

    public onPeopleSetPropertiesPress(): void {
        console.log("Test: People Set Properties");
        if (!this.people) {
            console.error("Please press 'Get People' first.");
            return;
        }
        this.people.set(this.testProps);
    }

    // Other
    public onOptOutPress(): void {
        console.log("Test: Opt Out of Tracking");
        NativeScriptMixpanel.optOutTracking();
    }

    public onOptInPress(): void {
        console.log("Test: Opt In to Tracking");
        NativeScriptMixpanel.optInTracking();
    }

    public onFlushPress(): void {
        console.log("Test: Flush");
        NativeScriptMixpanel.flush();
    }

    public onResetPress(): void {
        console.log("Test: Reset");
        NativeScriptMixpanel.reset();
    }
}
