import {QuickFix, QuickFixQueryInformation, Refactoring} from "./quickFix";
import * as ts from "typescript";
import * as ast from "./astUtils";
import {EOL} from "os";
import {displayPartsToString, typeToDisplayParts, SyntaxKind} from "typescript";

class QuoteToTemplate implements QuickFix {
    key = QuoteToTemplate.name;

    canProvideFix(info: QuickFixQueryInformation): string {
        if (info.positionNode.kind === SyntaxKind.StringLiteral) {
            return `Convert to Template String`;
        }
    }

    provideFix(info: QuickFixQueryInformation): Refactoring[] {

        var text = info.positionNode.getText();
        var quoteCharacter = text.trim()[0];
        var nextQuoteCharacter = '`';

        // The following code is same as `quotesToQuotes. Refactor!`

        var quoteRegex = new RegExp(quoteCharacter, 'g')
        var escapedQuoteRegex = new RegExp(`\\\\${quoteCharacter}`, 'g')
        var nextQuoteRegex = new RegExp(nextQuoteCharacter, 'g')

        var newText = text
            .replace(nextQuoteRegex, `\\${nextQuoteCharacter}`)
            .replace(escapedQuoteRegex, quoteCharacter);

        newText = nextQuoteCharacter + newText.substr(1, newText.length - 2) + nextQuoteCharacter

        var refactoring: Refactoring = {
            span: {
                start: info.positionNode.getStart(),
                length: info.positionNode.end - info.positionNode.getStart()
            },
            newText,
            filePath: info.filePath
        };

        return [refactoring];
    }
}

export default QuoteToTemplate;