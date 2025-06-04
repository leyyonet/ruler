import { strict as assert } from 'assert';
import {ruleFetch, UseRule} from "../src";
import {myRule} from "./my-rule";
import {reflectionPool} from "@leyyo/core";
import {TmpClass, TmpField, TmpMethod, TmpParam} from "./decorators";
import {before} from "node:test";

describe('RulePool', () => {
    @UseRule(myRule({
        classDesc: 'My class',
        myField1Type: String,

        myProperty1Desc: 'property 1',
        myProperty1Type: RegExp,

        myMethod1Desc: 'method 1',
        myMethod1Type: Array,

        myParam11Desc: 'param 1',
        myParam12Desc: 'param 2',

    }))
    class MyClass1 {


        constructor(private myField1: unknown, private myField2: unknown) {
        }

        myProperty1: unknown;
        myProperty2: unknown;

        myMethod1(myParam10: unknown, myParam11: unknown, myParam12: unknown, myParam13: unknown): void {

        }

        myMethod2(myParam20: unknown): void {

        }

    }

    ruleFetch.initialize();

    const clazz = reflectionPool.get(MyClass1);
    const ctor = clazz.getInstanceProperty('constructor');
    const field_1 = ctor.getParameter('myField1');
    const field_2 = ctor.getParameter('myField2');
    const prop_1 = clazz.getInstanceProperty('myProperty1');
    const prop_2 = clazz.getInstanceProperty('myProperty2');
    const method_1 = clazz.getInstanceProperty('myMethod1');
    const param_1_0 = method_1.getParameter('myParam10');
    const param_1_1 = method_1.getParameter('myParam11');
    const param_1_2 = method_1.getParameter('myParam12');
    const param_1_3 = method_1.getParameter('myParam13');

    const method_2 = clazz.getInstanceProperty('myMethod2');
    const param_2_1 = method_2.getParameter('myParam20');

    it('+ clazz Rules', () => {
        assert.equal(clazz.hasDecorator(TmpClass), true);
    });
    it('- clazz Value', () => {
        assert.deepEqual(clazz.getValueByDeco(TmpClass), {description: 'My class'});
    });

    it('+ ctor.field_1 is typed', () => {
        assert.equal(field_1.type, String);
    });
    it('- ctor.field_2 is not typed', () => {
        assert.equal(field_2.type, undefined);
    });

    it('+ prop_1 Ruled', () => {
        assert.equal(prop_1.hasDecorator(TmpField), true);
    });
    it('+ prop_1 value', () => {
        assert.deepEqual(prop_1.getValueByDeco(TmpField), {description: 'property 1'});
    });
    it('+ prop_1 Typed', () => {
        assert.equal(prop_1.type, RegExp);
    });

    it('- prop_2 Ruled', () => {
        assert.equal(prop_2.hasDecorator(TmpField), false);
    });
    it('- prop_2 Value', () => {
        assert.equal(prop_2.getValueByDeco(TmpField), undefined);
    });

    it('- prop_2 Typed', () => {
        assert.equal(prop_2.type, undefined);
    });

    it('+ method_1 Ruled', () => {
        assert.equal(method_1.hasDecorator(TmpMethod), true);
    });
    it('+ method_1 value', () => {
        assert.deepEqual(method_1.getValueByDeco(TmpMethod), {description: 'method 1'});
    });
    it('+ method_1 Typed', () => {
        assert.equal(method_1.type, Array);
    });

    it('- param_1_0 Ruled', () => {
        assert.equal(param_1_0.hasDecorator(TmpParam), false);
    });
    it('- param_1_0 Value', () => {
        assert.equal(param_1_0.getValueByDeco(TmpParam), undefined);
    });

    it('+ param_1_1 Ruled', () => {
        assert.equal(param_1_1.hasDecorator(TmpParam), true);
    });
    it('+ param_1_1 Value', () => {
        assert.deepEqual(param_1_1.getValueByDeco(TmpParam), {description: 'param 1'});
    });

    it('+ param_1_2 Ruled', () => {
        assert.equal(param_1_2.hasDecorator(TmpParam), true);
    });
    it('+ param_1_2 Value', () => {
        assert.deepEqual(param_1_2.getValueByDeco(TmpParam), {description: 'param 2'});
    });

    it('- param_1_3 Ruled', () => {
        assert.equal(param_1_3.hasDecorator(TmpParam), false);
    });
    it('- param_1_3 Value', () => {
        assert.equal(param_1_3.getValueByDeco(TmpParam), undefined);
    });

    it('- method_2 Ruled', () => {
        assert.equal(method_2.hasDecorator(TmpMethod), false);
    });
    it('- method_2 value', () => {
        assert.equal(method_2.getValueByDeco(TmpMethod), undefined);
    });
    it('- method_2 Typed', () => {
        assert.equal(method_2.type, undefined);
    });

    it('- param_2_1 Ruled', () => {
        assert.equal(param_2_1.hasDecorator(TmpParam), false);
    });
    it('- param_2_1 Value', () => {
        assert.deepEqual(param_2_1.getValueByDeco(TmpParam), undefined);
    });
});
