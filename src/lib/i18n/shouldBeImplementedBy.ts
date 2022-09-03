import { mustBeString } from '../checks/mustBeString';
import { LocalizableMessage } from './LocalizableMessage';

/**
 * @hidden
 */
export function shouldBeImplementedBy(name: string, type: string): LocalizableMessage {
    mustBeString('name', name);
    const message: LocalizableMessage = {
        get message(): string {
            return `Method '${name}' should be implemented by ${type}.`;
        }
    };
    return message;
}
