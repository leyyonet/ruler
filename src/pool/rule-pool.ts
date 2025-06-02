import {decoratorPool, Fqn, lifecycle} from '@leyyo/core';
import {RulePoolLike} from './index.types';
import { FQN } from '../internal';
import {Rule, RuleOpt, UseRule, UseRuleOpt} from "../decorators";

@Fqn(FQN)
class RulePool implements RulePoolLike {

    constructor() {
        lifecycle.onAll(FQN)
            .before('leyyo.cast')
            .before('leyyo.injection')
            .before('leyyo.validator')
            .before('leyyo.pipe')
            .before('leyyo.middleware')

        lifecycle.onInitialize(FQN, () => this.initialize());

    }
    private _fetchRules(): void {
        const id = decoratorPool.get(Rule, true).asIdentifier;
        id
            .instances
            .forEach(ins => {
                ins.asClass;
                ins.getValue<RuleOpt>();
            });

    }
    private _fetchUses(): void {
        const id = decoratorPool.get(UseRule, true).asIdentifier;
        id
            .instances
            .forEach(ins => {
                ins.getValue<UseRuleOpt>();
                switch (ins.target) {
                    case "class":
                        ins.asClass;
                        break;
                    case "method":
                        ins.asMethod;
                        break;
                    case "field":
                        ins.asField;
                        break;
                    case "parameter":
                        ins.asParameter;
                        break;
                }
            });

    }
    private _implement(): void {
        // nothing
    }
    initialize(): void {
        this._fetchRules();
        this._fetchUses();
        this._implement();
    }

}
export const rulePool: RulePoolLike = new RulePool();
