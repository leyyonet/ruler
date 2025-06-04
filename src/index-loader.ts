import {ruleFetch, ruleHub} from "./hub";
import {IgnoreRules, Rule, RuleType, UseRule} from "./decorators";

export const $$RulerLoader = [ruleHub, ruleFetch, Rule, UseRule, IgnoreRules, RuleType];
