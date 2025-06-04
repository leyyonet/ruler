import { Loader } from '@leyyo/injection';
import { Fqn } from '@leyyo/core';
import { FQN } from './internal';
import {ruleFetch, ruleHub} from "./hub";
import {IgnoreRules, Rule, UseRule} from "./decorators";

@Loader(ruleHub, ruleFetch, Rule, UseRule, IgnoreRules)
@Fqn(FQN)
export class RulerLoader {}
