import {matchesConfigType} from "./matches-config-type";
import {regexesType} from "./regexes-type";

export type configType = {
    path: string;
    matches: matchesConfigType;
    imagePosition: number;
    imageSize: imageSizeType;
    regexes: regexesType,
};

export type imageSizeType = {
    width: number;
    height: number;
};
