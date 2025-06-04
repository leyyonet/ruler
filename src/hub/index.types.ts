import {ClassLike, Func} from "@leyyo/common";
import {ClassReflectionLike} from "@leyyo/core";

export interface RuleHubLike {
    create(rule: string, opt: RuleClassOpt): RuleClass;
}

export interface RuleClassOpt {
    decorators?: Array<ClassDecorator>;
    ctor?: RuleConstructorOpt;
    instanceMethods?: Array<RuleMethodOpt>;
    instanceFields?: Array<RuleFieldOpt>;
    staticMethods?: Array<RuleMethodOpt>;
    staticFields?: Array<RuleFieldOpt>;
}
export interface RuleClass {
    clazz: ClassLike;
    ref: ClassReflectionLike;
}

export interface RuleParamOpt {
    name: string;
    index?: number;
    type?: Func|ClassLike;
    hasDefault?: boolean;
    isVariadic?: boolean;
    decorators?: Array<ParameterDecorator>;
}
export interface RuleFieldOpt {
    name: string;
    type?: Func|ClassLike;
    decorators?: Array<PropertyDecorator>;
}
export interface RuleConstructorOpt {
    parameters?: Array<RuleParamOpt>;
}

export interface RuleMethodOpt extends RuleConstructorOpt {
    name: string;
    type?: Func|ClassLike;
    decorators?: Array<MethodDecorator>;
}

export type RuleDeco = ClassDecorator | MethodDecorator | PropertyDecorator | ParameterDecorator;
