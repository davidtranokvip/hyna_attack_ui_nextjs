export const convertToUppercaseWords = (text: string): string => {
    if (!text) return '';
    
    const textWithSpaces = text.replace(/_/g, ' ');
    
    return textWithSpaces.toUpperCase();
};