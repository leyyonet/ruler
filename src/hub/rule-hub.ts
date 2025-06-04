import {$assert, $dev, $is, $name, Func} from "@leyyo/common";
import {
    ClassReflectionLike,
    CoreReflectionLike, DecoKeyword,
    Fqn,
    fqnHandler,
    PropertyReflectionLike,
    reflectionPool
} from '@leyyo/core';

import {
    RuleClass,
    RuleClassOpt, RuleConstructorOpt,
    RuleDeco,
    RuleFieldOpt,
    RuleHubLike,
    RuleMethodOpt,
    RuleParamOpt
} from './index.types';
import {FQN} from '../internal';
import {RuleFetch, RuleFetchLike} from "../fetch";
import {Rule} from "../decorators";

@Fqn(FQN)
class RuleHub implements RuleHubLike {

    constructor() {
    }

    private _assignDecorators<R extends CoreReflectionLike>(rule: string, ref:R, decorators: Array<RuleDeco>, args: Array<any>): void {
        if ($is.empty(decorators)) {
            return;
        }
        if (Array.isArray(decorators) && decorators.length < 1) {
            return;
        }

        $assert.funcArray(decorators, () => $dev.opt({rule, field: 'decorators', desc: ref.description, where: `${FQN}.RuleHub#create`}));
        decorators.forEach(dec => {
            try {
                // @ts-ignore
                dec(...args);
            } catch (e) {
                console.error(e.message);
            }
        });
    }
    private _createFields(rule: string, ref: ClassReflectionLike, fields: Array<RuleFieldOpt>, keyword: DecoKeyword): void {
        if ($is.empty(fields)) {
            return;
        }
        if (Array.isArray(fields) && fields.length < 1) {
            return;
        }
        const holder = keyword === 'static' ? ref.creator : ref.creator.prototype;
        fields.forEach((field, index) => {
            $assert.text(field.name, () => $dev.opt({rule, field: `fields[${keyword}].name`, index, where: `${FQN}.RuleHub#create`}));
            $assert.funcOptional(field.type, () => $dev.opt({rule, field: `fields[${keyword}].type`, index, where: `${FQN}.RuleHub#create`}));

            const fieldRef = ref.$secure.$createProperty(field.name, keyword, 'field');
            if (field.type) {
                fieldRef.$secure.$setType(field.type as Func);
            }
            holder[field.name] = null;
            const descriptor = {
                writable: true,
                configurable: true,
                enumerable: true,
                value: null,
            } as PropertyDescriptor;
            Object.defineProperty(holder, field.name, descriptor);

            this._assignDecorators(rule, fieldRef, field.decorators, [holder, field.name]);
        });
    }
    private _createMethods(rule: string, ref: ClassReflectionLike, methods: Array<RuleMethodOpt>, keyword: DecoKeyword): void {
        if ($is.empty(methods)) {
            return;
        }
        if (Array.isArray(methods) && methods.length < 1) {
            return;
        }

        const holder = keyword === 'static' ? ref.creator : ref.creator.prototype;

        methods.forEach((method, index) => {
            $assert.text(method.name, () => $dev.opt({rule, field: `methods[${keyword}].name`, index, where: `${FQN}.RuleHub#create`}));
            $assert.funcOptional(method.type, () => $dev.opt({rule, field: `methods[${keyword}].type`, index, where: `${FQN}.RuleHub#create`}));

            const methodRef = ref.$secure.$createProperty(method.name, keyword, 'method');
            if (method.type) {
                methodRef.$secure.$setType(method.type as Func);
            }
            const callable = () => undefined;
            holder[method.name] = callable;
            methodRef.$secure.$setCallable(callable);

            const descriptor = {
                writable: true,
                configurable: true,
                enumerable: true,
                value: callable,
            } as TypedPropertyDescriptor<unknown>;
            Object.defineProperty(holder, method.name, descriptor);

            this._assignDecorators(rule, methodRef, method.decorators, [holder, method.name, descriptor]);

            this._createParameters(rule, methodRef, method.parameters);
        });
    }

    private _createParameters(rule: string, methodRef: PropertyReflectionLike, parameters: Array<RuleParamOpt>): void {
        if ($is.empty(parameters)) {
            return;
        }
        if (Array.isArray(parameters) && parameters.length < 1) {
            return;
        }
        const holder = methodRef.keyword === 'static' ? methodRef.clazz.creator : methodRef.clazz.creator.prototype;

        $assert.array(parameters, () => $dev.opt({rule, field: `${methodRef.name}.parameters`, where: `${FQN}.RuleHub#create`}));
        parameters.forEach((param, index) => {
            $assert.bareObject(param, () => $dev.opt({rule, field: `${methodRef.name}.parameters[${index}]`, where: `${FQN}.RuleHub#create`}));
            const paramRef = methodRef.$secure.$createParameter(param.index, param.type as Func, param.name);
            this._assignDecorators(rule, paramRef, param.decorators, [holder, methodRef.name, paramRef.index]);
        });
    }
    private _createConstructor(rule: string, ref: ClassReflectionLike, ctor: RuleConstructorOpt): void {
        if ($is.empty(ctor)) {
            return;
        }
        $assert.bareObject(ctor, () => $dev.opt({rule, field: 'ctor/constructor', where: `${FQN}.RuleHub#create`}));
        const methodRef = ref.$secure.$createProperty('constructor', 'instance', 'method', ref.creator as Func);
        methodRef.$secure.$setType(ref.creator as Func);
        this._createParameters(rule, methodRef, ctor.parameters);
    }
    create(rule: string, opt: RuleClassOpt): RuleClass {
        $assert.text(rule, () => $dev.opt({field: 'rule', where: `${FQN}.RuleHub#create`}));
        $assert.bareObject(opt, () => $dev.opt({rule, field: 'option', where: `${FQN}.RuleHub#create`}));

        const clazz = class {};
        $name.set(clazz, $name.anonymous('Rule'));
        fqnHandler.clazz(clazz, FQN);
        const ref = reflectionPool.registerClass(clazz);
        const result = {clazz, ref} as RuleClass;

        this._assignDecorators(rule, ref, opt.decorators, [clazz]);
        if (!ref.hasDecorator(Rule)) {
            Rule(rule)(clazz);
        }

        this._createConstructor(rule, ref, opt.ctor);
        this._createFields(rule, ref, opt.staticFields, 'static');
        this._createFields(rule, ref, opt.instanceFields, 'instance');
        this._createMethods(rule, ref, opt.staticMethods, 'static');
        this._createMethods(rule, ref, opt.instanceMethods, 'instance');

        return result;
    }

}

export const ruleHub: RuleHubLike = new RuleHub();
export const ruleFetch: RuleFetchLike = new RuleFetch(ruleHub);
