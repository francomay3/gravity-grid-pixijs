class Planet {
private:
    int count;

public:
    Planet() : count(0) {}
    int getCount() const { return count; }
    void increment() { count++; }
    void decrement() { count--; }
};

// Global pointer to manage a single counter instance
Planet* globalCounter = nullptr;

extern "C" {
    int getCount() {
        return globalCounter ? globalCounter->getCount() : 0;
    }

    void increment() {
        if (globalCounter) {
            globalCounter->increment();
        }
    }

    void decrement() {
        if (globalCounter) {
            globalCounter->decrement();
        }
    }

    void createCounter() {
        if (!globalCounter) {
            globalCounter = new Planet();
        }
    }

    void destroyCounter() {
        if (globalCounter) {
            delete globalCounter;
            globalCounter = nullptr;
        }
    }
}

// compiled with
// emcc counter.cpp -s WASM=1 --no-entry -s "EXPORTED_FUNCTIONS=['_getCount', '_increment', '_createCounter', '_destroyCounter', '_decrement']" -o counter.wasm
