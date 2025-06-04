import {ClassLike} from "@leyyo/common";
import {CastType} from "@leyyo/cast";

import {ruleHub} from "../src";
import {TmpClass, TmpField, TmpMethod, TmpParam} from "./decorators";

interface MyRuleOpt {
    classDesc: string
    myField1Type: ClassLike;

    myProperty1Desc: string;
    myProperty1Type: ClassLike;

    myMethod1Desc: string;
    myMethod1Type: ClassLike;

    myParam11Desc: string;
    myParam12Desc: string;

}

export function myRule(opt: MyRuleOpt): ClassLike {

    const created = ruleHub.create('MyRule', {
        decorators: [
            TmpClass(opt.classDesc)
        ],
        ctor: {
            parameters: [
                {
                    name: 'myField1',
                    type: opt.myField1Type,
                    decorators: [
                        CastType(opt.myField1Type)
                    ]
                }
            ]
        },
        instanceMethods: [
            {
                name: 'myMethod1',
                type: opt.myMethod1Type,
                decorators: [
                    TmpMethod(opt.myMethod1Desc),
                    CastType(opt.myMethod1Type, true),
                ],
                parameters: [
                    {
                        name: 'myParam11',
                        type: String,
                        decorators: [
                            TmpParam(opt.myParam11Desc),
                        ]
                    },
                    {
                        name: 'myParam12',
                        type: String,
                        decorators: [
                            TmpParam(opt.myParam12Desc),
                        ]
                    }
                ]
            }
        ],
        instanceFields: [
            {
                name: 'myProperty1',
                type: opt.myProperty1Type,
                decorators: [
                    TmpField(opt.myProperty1Desc),
                    CastType(opt.myProperty1Type),
                ]
            }
        ],
        staticMethods: [],
        staticFields: [],
    });
    return created.clazz;
}
