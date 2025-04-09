export const getSectionName = (key: string) => {
    switch (key) {
        case "writing": return "Writing";
        case "speaking": return "Speaking";
        case "reading": return "Reading";
        case "listening": return "Listening";
    }
}

export const sectionImages = [
    "/icon/sections/reading.svg",
    "/icon/sections/listening.svg",
    "/icon/sections/writing.svg",
    "/icon/sections/speaking.svg",
]