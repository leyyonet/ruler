import { decoratorPool } from '@leyyo/core';
import {$assert, $dev, Func} from "@leyyo/common";

import { FQN } from '../internal';

export interface RuleOpt {
    config: RulerConfig;
}
export interface RulerConfig {
    temp?: string;
}

/**
 * Declare a rule
 */
export function Rule(config?: RulerConfig): ClassDecorator {
    return (clazz: Func) =>
        deco.process([clazz], { config });
}

const deco = decoratorPool
    .newId<RuleOpt>(Rule)
    .fqn(FQN)
    .targets('class')
    .keywords('ruler')
    .processor((ins, p) => {
        $assert.objectOptional(p.config, () => $dev.desc(ins, {field: 'config'}));
        if (!p.config) {
            p.config = {};
        }
        ins.set(p);
    });
