export function getArg(args, name, defaultValue)
{
    if (args && args[name] !== undefined) {
        return args[name];
    }
    return defaultValue;
}
