from typing import TypedDict, Literal


class Config(TypedDict):
    config: dict


class Epsilon(TypedDict):
    start: float
    end: float
    decay: float


class Target_Update(Config):
    mode: Literal['soft', 'hard']


class ClipGrads(Config):
    name: Literal['clip_grad_norm_', 'clip_grad_value_']


class Criterion(Config):
    name: Literal['L1Loss', 'NLLLoss', 'NLLLoss2d', 'PoissonNLLLoss', 'GaussianNLLLoss', 'KLDivLoss',
                  'MSELoss', 'BCELoss', 'BCEWithLogitsLoss', 'HingeEmbeddingLoss', 'MultiLabelMarginLoss',
                  'SmoothL1Loss', 'HuberLoss', 'SoftMarginLoss', 'CrossEntropyLoss', 'MultiLabelSoftMarginLoss',
                  'CosineEmbeddingLoss', 'MarginRankingLoss', 'MultiMarginLoss', 'TripletMarginLoss',
                  'TripletMarginWithDistanceLoss', 'CTCLoss']


class Optimizer(Config):
    name: Literal['Adadelta', 'Adagrad', 'Adam', 'AdamW', 'SparseAdam',
                  'Adamax', 'ASGD', 'SGD', 'RAdam', 'Rprop', 'RMSprop', 'NAdam', 'LBFGS']


class Scheduler(Config):
    name: Literal['LambdaLR', 'MultiplicativeLR', 'StepLR', 'MultiStepLR', 'ConstantLR', 'LinearLR',
                  'ExponentialLR', 'SequentialLR', 'CosineAnnealingLR', 'ChainedScheduler', 'ReduceLROnPlateau',
                  'CyclicLR', 'CosineAnnealingWarmRestarts', 'OneCycleLR', 'PolynomialLR', 'LRScheduler']


class Rewards(TypedDict):
    win: float
    loss: float
    draw: float
    prolongation: float


class Checkpoint(TypedDict):
    save_every: int | None
    save_on_exit: bool


class ParamsAgent(TypedDict):
    batch_size: int
    clip_grads: ClipGrads | None
    criterion: Criterion
    double: bool
    epsilon: Epsilon
    gamma: float
    memory__maxlen: int
    optimizer: Optimizer
    out_features: int
    target_update: Target_Update


class ParamsEnv(TypedDict):
    action_space: int
    observation_space: int
    rewards: Rewards


class ParamsEval(TypedDict):
    enforce_valid_action: bool
    episodes: int
    period: int


class ParamsTrain(TypedDict):
    batch_size: int
    checkpoint: Checkpoint
    display_period: int
    enforce_valid_action: bool
    episodes: int
    scheduler: None | Scheduler
