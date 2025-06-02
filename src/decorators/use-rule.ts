import { decoratorPool } from '@leyyo/core';
import {$assert, $dev, ClassLike, Dict, Func} from "@leyyo/common";

import { FQN } from '../internal';

export interface UseRuleOpt {
    rule: Func|ClassLike;
    values: Dict;
}

/**
 * Declare a rule
 */
export function UseRule<O = Dict>(rule: Func, values: O): PropertyDecorator & ParameterDecorator & ClassDecorator & MethodDecorator {
    return (clazz: object, property?: PropertyKey, indexOrDescriptor?: number|TypedPropertyDescriptor<unknown>) =>
        deco.process([clazz, property, indexOrDescriptor], { rule, values });
}

const deco = decoratorPool
    .newId<UseRuleOpt>(UseRule)
    .fqn(FQN)
    .targets('field', 'parameter', 'class', 'method')
    .keywords('ruler')
    .processor((ins, p) => {
        $assert.func(p.rule, () => $dev.desc(ins, {field: 'rule'}));
        $assert.objectOptional(p.values, () => $dev.desc(ins, {field: 'values'}));
        if (!p.values) {
            p.values = {};
        }
        ins.set(p);
    });
