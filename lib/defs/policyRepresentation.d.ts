export declare enum DecisionStrategy {
    AFFIRMATIVE = "AFFIRMATIVE",
    UNANIMOUS = "UNANIMOUS",
    CONSENSUS = "CONSENSUS"
}
export declare enum Logic {
    POSITIVE = "POSITIVE",
    NEGATIVE = "NEGATIVE"
}
export default interface PolicyRepresentation {
    config?: Record<string, any>;
    decisionStrategy?: DecisionStrategy;
    description?: string;
    id?: string;
    logic?: Logic;
    name?: string;
    owner?: string;
    policies?: string[];
    resources?: string[];
    scopes?: string[];
    type?: string;
}
