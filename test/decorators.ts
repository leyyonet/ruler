import {decoratorPool} from "@leyyo/core";
import {FQN} from "../src/internal";

export function TmpClass(description: string): ClassDecorator {
    return (clazz) => {
        idTmpClass.fork(clazz).set({description});
    }
}
const idTmpClass = decoratorPool
    .newId(TmpClass)
    .fqn(FQN)
    .targets('class');

export function TmpMethod(description: string): MethodDecorator {
    return (clazz, propertyKey, descriptor) => {
        idTmpMethod.fork(clazz, propertyKey, descriptor).set({description});
    }
}
const idTmpMethod = decoratorPool
    .newId(TmpMethod)
    .fqn(FQN)
    .targets('method');

export function TmpField(description: string): PropertyDecorator {
    return (clazz, propertyKey) => {
        idTmpField.fork(clazz, propertyKey).set({description});
    }
}
const idTmpField = decoratorPool
    .newId(TmpField)
    .fqn(FQN)
    .targets('field');

export function TmpParam(description: string): ParameterDecorator {
    return (clazz, propertyKey, index) => {
        idTmpParam.fork(clazz, propertyKey, index).set({description});
    }
}
const idTmpParam = decoratorPool
    .newId(TmpParam)
    .fqn(FQN)
    .targets('parameter');
