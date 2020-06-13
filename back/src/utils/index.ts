export const getAPIurl = (id: string, location: string, stage: string): string => {
    return "https://" + id + ".execute-api." + location + ".amazonaws.com/" + stage
};