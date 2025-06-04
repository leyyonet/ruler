import { decoratorPool } from '@leyyo/core';
import {$assert, $dev, Func} from "@leyyo/common";

import { FQN } from '../internal';

/**
 * Declare a rule
 */
export function Rule(name?: string): ClassDecorator {
    return ((clazz: Func) => {
        id.process([clazz], { });
        return clazz;
    }) as ClassDecorator;
}

const id = decoratorPool
    .newId(Rule)
    .fqn(FQN)
    .targets('class')
    .rules('override-if-exists', 'no-copy')
    .keywords('ruler')
    .processor((ins, p) => {
        $assert.objectOptional(p.config, () => $dev.desc(ins, {field: 'config'}));
        if (!p.config) {
            p.config = {};
        }
        ins.set(p);
    });
