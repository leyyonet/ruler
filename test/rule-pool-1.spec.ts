import { strict as assert } from 'assert';
import {ruleFetch, UseRule} from "../src";
import {myRule} from "./my-rule";
import {reflectionPool} from "@leyyo/core";
import {TmpClass, TmpField, TmpMethod, TmpParam} from "./decorators";

describe('RulePool', () => {
    @UseRule(myRule({
        classDesc: 'My class a',
        myField1Type: Boolean,

        myProperty1Desc: 'property 1a',
        myProperty1Type: Array,

        myMethod1Desc: 'method 1a',
        myMethod1Type: Object,

        myParam11Desc: 'param 1a',
        myParam12Desc: 'param 2a',

    }))
    class MyClass2 {


        constructor(private myField1: unknown) {
        }

        myProperty1: unknown;

        myMethod1(myParam11: unknown): void {

        }

    }
    ruleFetch.initialize();

    const clazz = reflectionPool.get(MyClass2);
    const ctor = clazz.getInstanceProperty('constructor');
    const field_1 = ctor.getParameter('myField1');
    const prop_1 = clazz.getInstanceProperty('myProperty1');
    const method_1 = clazz.getInstanceProperty('myMethod1');
    const param_1_1 = method_1.getParameter('myParam11');

    it('+ clazz Rules', () => {
        assert.equal(clazz.hasDecorator(TmpClass), true);
    });
    it('- clazz Value', () => {
        assert.deepEqual(clazz.getValueByDeco(TmpClass), {description: 'My class a'});
    });

    it('+ ctor.field_1 is typed', () => {
        assert.equal(field_1.type, Boolean);
    });

    it('+ prop_1 Ruled', () => {
        assert.equal(prop_1.hasDecorator(TmpField), true);
    });
    it('+ prop_1 value', () => {
        assert.deepEqual(prop_1.getValueByDeco(TmpField), {description: 'property 1a'});
    });
    it('+ prop_1 Typed', () => {
        assert.equal(prop_1.type, Array);
    });

    it('+ method_1 Ruled', () => {
        assert.equal(method_1.hasDecorator(TmpMethod), true);
    });
    it('+ method_1 value', () => {
        assert.deepEqual(method_1.getValueByDeco(TmpMethod), {description: 'method 1a'});
    });
    it('+ method_1 Typed', () => {
        assert.equal(method_1.type, Object);
    });

    it('+ param_1_1 Ruled', () => {
        assert.equal(param_1_1.hasDecorator(TmpParam), true);
    });
    it('+ param_1_1 Value', () => {
        assert.deepEqual(param_1_1.getValueByDeco(TmpParam), {description: 'param 1a'});
    });
});
