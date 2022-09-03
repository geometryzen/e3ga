import { mustBeString } from '../checks/mustBeString';
import { LocalizableMessage } from './LocalizableMessage';

/**
 * @hidden
 */
export function readOnly(name: string): LocalizableMessage {
    mustBeString('name', name);
    let message: LocalizableMessage = {
        get message(): string {
            return "Property `" + name + "` is readonly.";
        }
    };
    return message;
}
