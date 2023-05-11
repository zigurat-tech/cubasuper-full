import languageJSON from '../../public/locales/es/common.json';

type LangRecord = Record<string, string | Record<string, string>>;

type ReturnLang<ObjectType extends LangRecord> = {
    [Key in NestedKeyOf<ObjectType>]: Key;
};

type NestedKeyOf<ObjectType extends LangRecord> = {
    [Key in keyof ObjectType & string]: ObjectType[Key] extends LangRecord
        ? `${Key}.${SecondNestedKeyOf<ObjectType[Key]>}`
        : `${Key}`;
}[keyof ObjectType & string];

type SecondNestedKeyOf<ObjectType extends LangRecord> = {
    [Key in keyof ObjectType & string]: ObjectType[Key] extends string
        ? `${Key}`
        : never;
}[keyof ObjectType & string];

export type LanguageKeys = keyof ReturnLang<typeof languageJSON>;
