import {
    ClassReflectionLike, CoreReflectionLike, DecoInstanceLike,
    decoratorPool,
    Fqn,
    lifecycle,
    ParameterReflectionLike,
    PropertyReflectionLike,
    reflectionPool
} from '@leyyo/core';

import {RuleFetchLike} from './index.types';
import { FQN } from '../internal';
import {Rule, RuleType, UseRule, UseRuleOpt} from "../decorators";
import {$repo} from "@leyyo/common";
import {RuleHubLike} from "../hub";

@Fqn(FQN)
export class RuleFetch implements RuleFetchLike {
    private readonly _typedReflects = $repo.newList<CoreReflectionLike>(FQN, 'typedReflects');

    constructor(private hub: RuleHubLike) {
        lifecycle.onAll(FQN)
            .before('leyyo.cast')
            .before('leyyo.injection')
            .before('leyyo.validator')
            .before('leyyo.pipe')
            .before('leyyo.middleware')

        lifecycle.onInitialize(FQN, () => this.initialize());
        lifecycle.onClear(FQN, () => this.clear());

    }

    private _fetchRules(): void {
        const id = decoratorPool.get(Rule, true).asIdentifier;
        id
            .instances
            .forEach(ins => {
                ins.asClass.setMetaKey('$isRule', true);
            });

    }

    private _copyDecorators<T extends CoreReflectionLike>(target: T, source: T): void {

        // it can be class, field, method and parameter
        (target as unknown as ClassReflectionLike).copyDecorators((source as unknown as ClassReflectionLike));

        // change type is valid for method, field and parameter, so class is not
        if (target.target === 'class') {
            return;
        }

        if (this._typedReflects.includes(target)) {
            return;
        }
        if (source.hasDecorator(RuleType)) {
            switch (source.target) {
                case 'parameter':
                    (target as unknown as ParameterReflectionLike).$secure.$setType(source.type);
                    break;
                case 'field':
                case 'method':
                    (target as unknown as PropertyReflectionLike).$secure.$setType(source.type);
                    break;
            }
        }
        this._typedReflects.push(target);
    }

    private _copyForClass(ins: DecoInstanceLike, givenOpt: UseRuleOpt, sourceClassRef: ClassReflectionLike): void {
        const targetClassRef = ins.asClass;
        const opt = givenOpt.asClass();
        let targetPropRef: PropertyReflectionLike;

        // copy class decorators
        this._copyDecorators(targetClassRef, sourceClassRef);

        // methods maybe
        if (opt.methods !== false) {
            sourceClassRef.listInstanceProperties({kind: 'method'})
                .forEach(sourceMethodRef => {

                    // selected method should be
                    if (opt.methods === true || (Array.isArray(opt.methods) && opt.methods.includes(sourceMethodRef.name))) {
                        targetPropRef = targetClassRef.getInstanceProperty(sourceMethodRef.name, {kind: 'method'});

                        // method exists
                        if (targetPropRef) {
                            // copy method decorators
                            this._copyDecorators(targetPropRef, sourceMethodRef);

                            // parameters maybe
                            if (opt.parameters === true) {

                                sourceMethodRef.listParameters().forEach(sourceParamRef => {
                                    const targetParamRef = targetPropRef.getParameter(sourceParamRef.name);

                                    // parameter exists
                                    if (targetParamRef) {

                                        // copy parameter decorators
                                        this._copyDecorators(targetParamRef, sourceParamRef);
                                    }
                                });
                            }
                        }
                    }
                });
        }

        // field maybe
        if (opt.fields !== false) {
            sourceClassRef.listInstanceProperties({kind: 'field'})
                .forEach(sourceFieldRef => {

                    // selected field should be
                    if (opt.fields === true || (Array.isArray(opt.fields) && opt.fields.includes(sourceFieldRef.name))) {
                        targetPropRef = targetClassRef.getInstanceProperty(sourceFieldRef.name, {kind: 'field'});

                        // field exists
                        if (targetPropRef) {
                            // copy field decorators
                            this._copyDecorators(targetPropRef, sourceFieldRef);
                        }
                        else {
                            targetClassRef.$secure.$copyProperty(sourceFieldRef);
                        }
                    }
                });
        }

    }
    private _copyForMethod(ins: DecoInstanceLike, givenOpt: UseRuleOpt, sourceClassRef: ClassReflectionLike): void {
        const targetMethodRef = ins.asMethod;
        const opt = givenOpt.asMethod();
        const methodName = opt.name ?? targetMethodRef.name;

        const sourceMethodRef = sourceClassRef.getInstanceProperty(methodName, {kind: 'method'});
        if (!sourceMethodRef) {
            // todo not found method
            return;
        }

        // copy method decorators
        this._copyDecorators(targetMethodRef, sourceMethodRef);

        // ignore parameters
        if (opt.parameters === false) {
            return;
        }

        let targetParamRef: ParameterReflectionLike;
        sourceMethodRef.listParameters().forEach(sourceParamRef => {
            if (opt.parameters === true || (opt.parameters as Array<string>).includes(sourceParamRef.name)) {
                targetParamRef = targetMethodRef.getParameter(sourceParamRef.name);
            }

            // parameter exists
            if (targetParamRef) {

                // copy parameter decorators
                this._copyDecorators(targetParamRef, sourceParamRef);
            }
        });
    }
    private _copyForField(ins: DecoInstanceLike, givenOpt: UseRuleOpt, sourceClassRef: ClassReflectionLike): void {
        const targetFieldRef = ins.asField;
        const opt = givenOpt.asField();
        const fieldName = opt.name ?? targetFieldRef.name;

        const sourceFieldRef = sourceClassRef.getInstanceProperty(fieldName, {kind: 'field'});
        if (!sourceFieldRef) {
            // todo not found field
            return;
        }

        // copy field decorators
        this._copyDecorators(targetFieldRef, sourceFieldRef);
    }

    private _copyForParameter(ins: DecoInstanceLike, givenOpt: UseRuleOpt, sourceClassRef: ClassReflectionLike): void {
        let sourceMethodRef: PropertyReflectionLike;
        const targetParamRef = ins.asParameter;
        const opt = givenOpt.asParam();

        if (opt.methodName) {
            sourceMethodRef = sourceClassRef.getInstanceProperty(opt.methodName, {kind: 'method'});
        }
        else {
            sourceMethodRef = sourceClassRef.getInstanceProperty(targetParamRef.property.name, {kind: 'method'});
        }
        if (!sourceMethodRef) {
            // todo method of param could not found
            return;
        }

        const paramName = opt.name ?? targetParamRef.name;
        if (!paramName) {
            // todo param does not have any name
            return;
        }

        const sourceParamRef = sourceMethodRef.getParameter(paramName);
        if (!sourceParamRef) {
            // todo param could not found
            return;
        }

        // copy parameter decorators
        this._copyDecorators(targetParamRef, sourceParamRef);
    }

    private _fetchUses(): void {
        const id = decoratorPool.get(UseRule, true).asIdentifier;
        id
            .instances
            .forEach(ins => {
                const opt = ins.getValue<UseRuleOpt>();

                const sourceClassRef = reflectionPool.get(opt.rule);
                if (!sourceClassRef) {
                    // todo - class could not be found
                    return;
                }
                if (!sourceClassRef.getMetaKey('$isRule')) {
                    // todo - class is not a rule
                    return;
                }
                switch (ins.target) {
                    case "class":
                        this._copyForClass(ins, opt, sourceClassRef);
                        break;
                    case "method":
                        this._copyForMethod(ins, opt, sourceClassRef);
                        break;
                    case "field":
                        this._copyForField(ins, opt, sourceClassRef);
                        break;
                    case "parameter":
                        this._copyForParameter(ins, opt, sourceClassRef);
                        break;
                }
            });

    }
    initialize(): void {
        this._fetchRules();
        this._fetchUses();
    }
    clear(): void {
        this._typedReflects.clear();
    }

}
