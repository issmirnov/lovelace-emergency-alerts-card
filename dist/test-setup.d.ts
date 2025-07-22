declare const mockHass: {
    states: {};
    services: {
        async_call: () => Promise<void>;
    };
    callService: () => Promise<void>;
    config: {
        language: string;
    };
};
