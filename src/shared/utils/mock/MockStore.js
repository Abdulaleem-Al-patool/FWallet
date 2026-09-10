const STORAGE_PREFIX = "fwallet_";


function getStorageKey(resource) {
    return `${STORAGE_PREFIX}${resource}`;
}


export function read(resource) {
    const key = getStorageKey(resource);

    const storedData = localStorage.getItem(key);

    if (!storedData) {
        return null;
    }

    try {
        return JSON.parse(storedData);
    } catch (error) {
        console.error(
            `Failed to parse ${resource}:`,
            error
        );

        return null;
    }
}


export function write(resource, data) {
    const key = getStorageKey(resource);

    localStorage.setItem(
        key,
        JSON.stringify(data)
    );

    return data;
}

export function remove(resource) {
    const key = getStorageKey(resource);

    localStorage.removeItem(key);
}



export function clear() {
    Object.keys(localStorage)
        .filter(key =>
            key.startsWith(STORAGE_PREFIX)
        )
        .forEach(key =>
            localStorage.removeItem(key)
        );
}


export function getUserData(resource, token) {
    const data = read(resource);

    if (!Array.isArray(data)) {
        return null;
    }

    const userData = data.find(
        item => item.token === token
    );

    return userData
        ? userData.data
        : null;
}



export function updateUserData(
    resource,
    token,
    newData
) {
    const data = read(resource);

    if (!Array.isArray(data)) {
        throw new Error(
            `${resource} must contain an array.`
        );
    }

    const userIndex = data.findIndex(
        item => item.token === token
    );

    if (userIndex === -1) {
        throw new Error(
            "User data was not found."
        );
    }

    data[userIndex] = {
        ...data[userIndex],
        data: newData
    };

    write(resource, data);

    return newData;
}



export async function initialize(
    resource,
    seedUrl
) {
    const existingData = read(resource);

    if (existingData !== null) {
        return existingData;
    }

    const response = await fetch(`/data/${seedUrl}`);

if (!response.ok) {
    console.error(
        `Failed to initialize ${resource}:`,
        response.statusText
    );

    throw new Error(`Failed to initialize ${resource}.`);
}

console.log(
    `Successfully fetched response for ${resource} from ${seedUrl}`
);
const text = await response.text();

console.log("RAW RESPONSE:");
console.log(text);

const seedData = JSON.parse(text);
//const seedData = await response.json();

console.log(
    `Successfully parsed JSON for ${resource}:`,
    seedData
);

write(resource, seedData);

console.log(
    `Data for ${resource} initialized successfully.`
);


    return seedData;
}