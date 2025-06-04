import { decoratorPool } from '@leyyo/core';
import {$assert, $dev, $is, ClassLike, Func} from "@leyyo/common";

import { FQN } from '../internal';

export interface IgnoreRulesOpt {
    all?: boolean;
    rules: Array<ClassLike|Func>;
}
/**
 * Declare a rule
 */
export function IgnoreRules(...rules: Array<ClassLike|Func>): MethodDecorator & PropertyDecorator | ParameterDecorator {
    return ((clazz: unknown, property: PropertyKey, indexOrDescriptor?: number|TypedPropertyDescriptor<unknown>) => {
        id.process([clazz, property, indexOrDescriptor], { rules });
        return clazz;
    }) as ClassDecorator;
}

const id = decoratorPool
    .newId<IgnoreRulesOpt>(IgnoreRules)
    .fqn(FQN)
    .targets('method', 'field', 'parameter')
    .rules('no-multiple')
    .keywords('ruler')
    .processor((ins, p) => {
        if (Array.isArray(p.rules) && p.rules.length > 0) {
            $assert.funcArray(p.rules, () => $dev.desc(ins, {field: 'config'}));
        }
        else {
            p.rules = [];
            p.all = true;
        }
        ins.set(p);
    });
