import { Fqn } from '@leyyo/core';
import {RulePoolLike} from './index.types';
import { FQN } from '../internal';

@Fqn(FQN)
class RulePool implements RulePoolLike {

    initialize(): void {
        // nothing
    }
}
export const rulePool: RulePoolLike = new RulePool();
