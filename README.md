# NativeScript Mixpanel

[![GitHub Workflow Status](https://img.shields.io/github/workflow/status/nstudio/nativescript-mixpanel/Build%20CI?style=flat-square)](https://github.com/nstudio/nativescript-mixpanel/actions?workflow=Build+CI)
[![npm](https://img.shields.io/badge/nativescript-7-blue?style=flat-square)](https://nativescript.org/)
[![npm](https://img.shields.io/npm/v/@nstudio/nativescript-mixpanel?style=flat-square)](https://www.npmjs.com/package/@nstudio/nativescript-mixpanel)
[![npm](https://img.shields.io/npm/dt/@nstudio/nativescript-mixpanel?style=flat-square)](https://www.npmjs.com/package/@nstudio/nativescript-mixpanel)

> A NativeScript plugin to provide the ability to integrate with Mixpanel.

## Installation

From your command prompt/terminal go to your application's root folder and execute:

`ns plugin add @nstudio/nativescript-mixpanel`

### NativeScript 6.5

`tns plugin add @nstudio/nativescript-mixpanel@2.1.0`

# Usage

## Example

This can be initialised at various points in your application, i.e. in a service. However it is recommended to initialise this in your `main.ts` file.

### Initialisation

```typescript
import {
  NativeScriptMixpanel,
  NativeScriptMixpanelPeople,
} from "@nstudio/nativescript-mixpanel";

const MIXPANEL_TOKEN = "ABCDEF12345678";

// Init Mixpanel itself
NativeScriptMixpanel.init(MIXPANEL_TOKEN);
```

### Identification

The Mixpanel library will assign a default unique identifier to each unique user who installs your application. This distinct ID is saved to device storage so that it will persist across sessions.

If you choose, you can assign your own user IDs. This is particularly useful if a user is using your app on multiple devices or platforms (both web and mobile, for example). To assign your own distinct_ids, you can use the `identify` method.

```typescript
import { NativeScriptMixpanel } from "@nstudio/nativescript-mixpanel";

const someId = "test identity";
NativeScriptMixpanel.identify(someId);
// It is recommended to identify both the base and people instances.
NativeScriptMixpanel.getPeople().identify(someId);
```

### Custom Logging / Logger Binding

If you need to pipe/funnel log output (i.e. for errors) to your own applications logger
implementation, you can provide a binding to your logger through a simple object.

**If you use this it is recommended to call `useLogger` before you `init`.**

```typescript
const customLogger: NativeScriptMixpanelLogger = {
  log: (tag: string, msg: string) => someOtherLogger.log(tag, msg),
  info: (tag: string, msg: string) => someOtherLogger.info(tag, msg),
  warn: (tag: string, msg: string) => someOtherLogger.warn(tag, msg),
  error: (tag: string, msg: string) => someOtherLogger.error(tag, msg),
};
NativeScriptMixpanel.useLogger(customLogger);
```

## API

### NativeScriptMixpanel

#### **`init(token: string): void`**

Get the instance of MixpanelAPI associated with your Mixpanel project token.

| Parameter | Type   | Description |
| --------- | ------ | ----------- |
| token     | string |             |

```typescript
NativeScriptMixpanel.init("token");
```

#### **`useLogger(providedLogger: NativeScriptMixpanelLogger): void`**

Replace the default console logger with a custom logger binding.

If you intend to use a custom logger or bound logger, this should
be called before `init` to correctly output any errors.

| Parameter      | Type                       | Description                                |
| -------------- | -------------------------- | ------------------------------------------ |
| providedLogger | NativeScriptMixpanelLogger | A new logger or object that binds a logger |

```typescript
const customLogger: NativeScriptMixpanelLogger = {
  log: (tag: string, msg: string) => someOtherLogger.log(tag, msg),
  info: (tag: string, msg: string) => someOtherLogger.info(tag, msg),
  warn: (tag: string, msg: string) => someOtherLogger.warn(tag, msg),
  error: (tag: string, msg: string) => someOtherLogger.error(tag, msg),
};
NativeScriptMixpanel.useLogger(customLogger);
```

#### **`identify(distinctId: string): void`**

Associate all future calls to track(string, JSON) with the user identified by the
given distinct id.

This call does not identify the user for People Analytics; to do that,
see MixpanelAPI.People.identify(String).
Mixpanel recommends using the same distinct_id for both calls, and using a
distinct_id that is easy to associate with the given user, for example, a
server-side account identifier.

Calls to track(string, JSON) made before corresponding calls to identify
will use an anonymous locally generated distinct id, which means it is best to
call identify early to ensure that your Mixpanel funnels and retention analytics
can continue to track the user throughout their lifetime. We recommend calling
identify when the user authenticates.

Once identify is called, the local distinct id persists across restarts of your application.

| Parameter  | Type   | Description                                                                                                                                                                                                                                                                                   |
| ---------- | ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| distinctId | string | A string uniquely identifying this user. Events sent to Mixpanel using the same distinct_id will be considered associated with the same visitor/customer for retention and funnel reporting, so be sure that the given value is globally unique for each individual user you intend to track. |

```typescript
NativeScriptMixpanel.identify("test identity");
```

#### **`getDistinctId(): string`**

Returns the string id currently being used to uniquely identify the user
associated with events sent using track. Before any calls to identify,
this will be an id automatically generated by the library.

```typescript
const distinctId = NativeScriptMixpanel.getDistinctId();
```

#### **`alias(alias: string): void`**

This function will create an alias to the current events distinct_id,
which may be the distinct_id randomly generated by the Mixpanel
library before identify(string) is called.

This call does not identify the user after. You must still call both
identify and NativeScriptMixPanel.getPeople().identify if you wish the
new alias to be used for Events and People.

| Parameter | Type   | Description         |
| --------- | ------ | ------------------- |
| alias     | string | The new distinct_id |

```typescript
NativeScriptMixpanel.alias("test alias");
```

#### **`registerSuperProperties(properties: JSON): void`**

Register properties that will be sent with every subsequent call
to track.

SuperProperties are a collection of properties that will be sent with every
event to Mixpanel, and persist beyond the lifetime of your application.

Setting a superProperty with registerSuperProperties will store a new
superProperty, possibly overwriting any existing superProperty with the
same name.

SuperProperties will persist even if your application is taken completely
out of memory. To remove a superProperty, call unregisterSuperProperty
or clearSuperProperties.

| Parameter  | Type | Description                                           |
| ---------- | ---- | ----------------------------------------------------- |
| properties | JSON | A JSON object containing super properties to register |

```typescript
NativeScriptMixpanel.registerSuperProperties({
  "Test Type": "test value",
});
```

#### **`unregisterSuperProperty(superPropertyName: string): void`**

Remove a single superProperty, so that it will not be sent with future calls
to track(String, JSONObject).

If there is a superProperty registered with the given name, it will be permanently
removed from the existing superProperties.

To clear all superProperties, use clearSuperProperties.

| Parameter         | Type   | Description                        |
| ----------------- | ------ | ---------------------------------- |
| superPropertyName | string | name of the property to unregister |

```typescript
NativeScriptMixpanel.unregisterSuperProperty("Test Type");
```

#### **`clearSuperProperties(): void`**

Erase all currently registered superProperties.

Future tracking calls to Mixpanel will not contain the specific superProperties
registered before the clearSuperProperties method was called.

To remove a single superProperty, use unregisterSuperProperty.

```typescript
NativeScriptMixpanel.clearSuperProperties();
```

#### **`track(eventName: string, properties?: JSON): void`**

Track an event.

Every call to track eventually results in a data point sent to Mixpanel.
These data points are what are measured, counted, and broken down to create
your Mixpanel reports. Events have a string name, and an optional set of
name/value pairs that describe the properties of that event.

| Parameter  | Type   | Description                                                                             |
| ---------- | ------ | --------------------------------------------------------------------------------------- |
| eventName  | string | The name of the event to send                                                           |
| properties | JSON   | A JSON object containing the key value pairs of the properties to include in this event |

```typescript
NativeScriptMixpanel.track("test event", {
  tracking: "this",
});
```

#### **`timeEvent(eventName: string): void`**

Begin timing of an event. Calling timeEvent("Thing") will not send an event,
but when you eventually call track("Thing"), your tracked event will be sent
with a "\$duration" property, representing the number of seconds between your calls.

| Parameter | Type   | Description                                |
| --------- | ------ | ------------------------------------------ |
| eventName | string | the name of the event to track with timing |

```typescript
const eventName = "Time Event Test";
NativeScriptMixpanel.timeEvent(eventName);

await new Promise((resolve) => setTimeout(resolve, 2000));
NativeScriptMixpanel.track(eventName);
```

#### **`getPeople(): NativeScriptMixpanelPeople`**

Returns a NativeScriptMixpanelPeople instance that can be used to identify
and set properties.

```typescript
const people = NativeScriptMixPanel.getPeople();
```

#### **`optInTracking(): void`**

Use this method to opt-in an already opted-out user from tracking.

People updates and track calls will be sent to Mixpanel after using
this method. This method will internally track an opt-in event to
your project.

```typescript
const people = NativeScriptMixPanel.optInTracking();
```

#### **`optOutTracking(): void`**

Use this method to opt-out a user from tracking.

Events and people updates that haven't been flushed yet will be deleted.
Use flush() before calling this method if you want to send all the queues
to Mixpanel before.

This method will also remove any user-related information from the device.

```typescript
const people = NativeScriptMixPanel.optOutTracking();
```

#### **`flush(): void`**

Push all queued Mixpanel events and People Analytics changes to Mixpanel servers.

Events and People messages are pushed gradually throughout the lifetime of your
application. This means that to ensure that all messages are sent to Mixpanel when
your application is shut down, you will need to call flush() to let the Mixpanel
library know it should send all remaining messages to the server.

We strongly recommend placing a call to flush() in the onDestroy() method of your
main application activity.

```typescript
NativeScriptMixpanel.flush();
```

#### **`reset(): void`**

Clears tweaks and all distinct_ids, superProperties, and push
registrations from persistent storage. Will not clear referrer information.

```typescript
NativeScriptMixpanel.reset();
```

## Contributors

- Alex Miller
- Antonio Cueva Urraco
- Blake Nussey
- Demetrio Filocamo
