import { Loader } from '@leyyo/injection';
import { Fqn } from '@leyyo/core';
import { FQN } from './internal';
import {rulePool} from "./pool";
import {Rule, UseRule} from "./decorators";

@Loader(rulePool, Rule, UseRule)
@Fqn(FQN)
export class RulerLoader {}
