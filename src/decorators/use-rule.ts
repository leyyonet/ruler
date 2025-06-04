import {DecoInstanceLike, decoratorPool, Target} from '@leyyo/core';
import {$assert, $dev, $is, ClassLike, Dict, Func} from "@leyyo/common";

import { FQN } from '../internal';

interface _UseRuleBaseOpt {
    rule: Func|ClassLike;
}
interface _UseRuleClassOpt {
    methods?: boolean | Array<string>;
    fields?: boolean | Array<string>;
    parameters?: boolean | Array<string>;
}

interface _UseRuleMethodOpt {
    name?: string;
    parameters?: boolean | Array<string>;
}

interface _UseRuleFieldOpt {
    name?: string;
}

interface _UseRuleParamOpt {
    methodName?: string;
    name?: string;
}

type _UseRuleAllOpt = _UseRuleClassOpt & _UseRuleMethodOpt & _UseRuleFieldOpt & _UseRuleParamOpt;
type _UseRuleAllParam = _UseRuleBaseOpt & _UseRuleClassOpt & _UseRuleMethodOpt & _UseRuleFieldOpt & _UseRuleParamOpt;
type _UseRuleAsTarget<T> = () => T;

export interface UseRuleOpt extends _UseRuleClassOpt, _UseRuleMethodOpt, _UseRuleFieldOpt, _UseRuleParamOpt {
    rule: Func|ClassLike;
    asClass(): _UseRuleClassOpt;
    asMethod(): _UseRuleMethodOpt;
    asField(): _UseRuleFieldOpt;
    asParam(): _UseRuleParamOpt;
}

/**
 * Declare a rule
 */
export function UseRule(rule: Func|ClassLike, opt?: _UseRuleClassOpt): ClassDecorator;
export function UseRule(rule: Func|ClassLike, opt?: _UseRuleMethodOpt): MethodDecorator;
export function UseRule(rule: Func|ClassLike, opt?: _UseRuleFieldOpt): PropertyDecorator;
export function UseRule(rule: Func|ClassLike, opt?: _UseRuleParamOpt): ParameterDecorator;
export function UseRule(rule: Func|ClassLike, opt?: _UseRuleAllOpt): PropertyDecorator & ParameterDecorator & ClassDecorator & MethodDecorator {
    return (clazz: object, property?: PropertyKey, indexOrDescriptor?: number|TypedPropertyDescriptor<unknown>) =>
        deco.process([clazz, property, indexOrDescriptor], {...(opt ?? {}), rule });
}

const deco = decoratorPool
    .newId<UseRuleOpt, Dict, _UseRuleAllParam>(UseRule)
    .fqn(FQN)
    .targets('field', 'parameter', 'class', 'method')
    .keywords('ruler')
    .processor((ins, p) => {
        const opt = {} as UseRuleOpt;

        buildInvalidTarget(ins, opt);
        buildRule(ins, opt, p);

        switch (ins.target) {
            case "class":
                buildForClass(ins, opt, p);
                break;
            case "method":
                buildForMethod(ins, opt, p);
                break;
            case "field":
                buildForField(ins, opt, p);
                break;
            case "parameter":
                buildForParam(ins, opt, p);
                break;
        }
        ins.set(opt);
    });

const buildRule = (ins: DecoInstanceLike, opt: UseRuleOpt, p:_UseRuleAllParam): void => {
    $assert.func(p.rule, () => $dev.desc(ins, {field: 'rule'}));
    opt.rule = p.rule;
}

const buildInvalidTarget = (ins: DecoInstanceLike, opt: UseRuleOpt): void => {
    if (ins.target !== 'class') {
        opt.asClass = invalidTarget<_UseRuleClassOpt>(ins.target, 'class');
    }
    if (ins.target !== 'method') {
        opt.asMethod = invalidTarget<_UseRuleMethodOpt>(ins.target, 'method');
    }
    if (ins.target !== 'field') {
        opt.asField = invalidTarget<_UseRuleFieldOpt>(ins.target, 'field');
    }
    if (ins.target !== 'parameter') {
        opt.asParam = invalidTarget<_UseRuleParamOpt>(ins.target, 'parameter');
    }
}

const invalidTarget = <T>(current: Target, expected: Target): _UseRuleAsTarget<T> => {
    return (() => {
        throw $dev.developerError2(FQN, 100, {
            message: 'Invalid target',
            expected, current,
        });
    }) as _UseRuleAsTarget<T>;
}
const buildForClass = (ins: DecoInstanceLike, opt: UseRuleOpt, p:_UseRuleAllParam): void => {
    if ($is.empty(p.methods)) {
        p.methods = true;
    }
    else if (typeof p.methods !== 'boolean') {
        $assert.textArray(p.methods, () => $dev.desc(ins, {field: 'methods', target: 'class'}));
    }
    opt.methods = p.methods;
    if ($is.empty(p.fields)) {
        p.fields = true;
    }
    else if (typeof p.fields !== 'boolean') {
        $assert.textArray(p.fields, () => $dev.desc(ins, {field: 'fields', target: 'class'}));
    }
    opt.fields = p.fields;
    if ($is.empty(p.parameters)) {
        p.parameters = true;
    }
    else {
        $assert.boolean(p.parameters, () => $dev.desc(ins, {field: 'parameters', target: 'class'}));
    }
    opt.parameters = p.parameters;
    opt.asClass = () => opt as _UseRuleClassOpt;

}

const buildForMethod = (ins: DecoInstanceLike, opt: UseRuleOpt, p:_UseRuleAllParam): void => {
    $assert.textOptional(p.name, () => $dev.desc(ins, {field: 'name', target: 'method'}));
    opt.name = p.name;

    if ($is.empty(p.parameters)) {
        p.parameters = true;
    }
    else if (typeof p.parameters !== 'boolean') {
        $assert.textArray(p.parameters, () => $dev.desc(ins, {field: 'parameters', target: 'method'}));
    }
    opt.parameters = p.parameters;

    opt.asMethod = () => opt as _UseRuleMethodOpt;
}
const buildForField = (ins: DecoInstanceLike, opt: UseRuleOpt, p:_UseRuleAllParam): void => {
    $assert.textOptional(p.name, () => $dev.desc(ins, {field: 'name', target: 'field'}));
    opt.name = p.name;

    opt.asField = () => opt as _UseRuleFieldOpt;
}
const buildForParam = (ins: DecoInstanceLike, opt: UseRuleOpt, p:_UseRuleAllParam): void => {
    $assert.textOptional(p.methodName, () => $dev.desc(ins, {field: 'methodName', target: 'parameter'}));
    opt.methodName = p.methodName;
    $assert.textOptional(p.name, () => $dev.desc(ins, {field: 'name', target: 'parameter'}));
    opt.name = p.name;

    opt.asParam = () => opt as _UseRuleParamOpt;
}
