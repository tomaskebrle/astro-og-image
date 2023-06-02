export type matchesConfigType = {
    regex: RegExp;
    namePrefix: string;
    find(param: (x: any) => boolean): matchesConfigType | undefined;
};
