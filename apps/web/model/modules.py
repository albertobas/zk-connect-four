import torch
import torch.nn as nn
import torch.nn.functional as F
import copy
from typing import Literal, List


class Module(nn.Module):
    def layer_summary(self, x_shape: List[int]) -> None:
        """
        Prints a summary of all the Conv2d, Flatten and Linear layers and their outputs to
        a Tensor with shape `x_sahpe`.

        Args:
            - `x_shape`: shape of the tensor used as input to the layers.
        """
        x = torch.randn(*x_shape)
        for module in self.policy.modules():
            if isinstance(module, nn.Conv2d) or isinstance(module, nn.Flatten) or isinstance(module, nn.Linear):
                x = module(x)
                title = f'{module.__class__.__name__} output shape:'
                print(f'{title:30}{x.shape}')


class ConnectFourNet(Module):
    def __init__(self, out_features: int):
        super(ConnectFourNet, self).__init__()

        self.policy = nn.Sequential(
            # (N, Cin, Hin, Win) -> (N, Cout, Hout, Wout)
            nn.Conv2d(
                in_channels=2,
                out_channels=16,
                kernel_size=3,
                stride=1,
                padding=1
            ),
            nn.ReLU(),
            # (N, Cin, Hin, Win) -> (N, Cout, Hout, Wout)
            nn.Conv2d(
                in_channels=16,
                out_channels=16,
                kernel_size=3,
                stride=1,
                padding=1
            ),
            nn.ReLU(),
            # (N, Cin, Hin, Win) -> (N, Hout)
            nn.Flatten(),
            # (N, Win) -> (N, Hout)
            nn.Linear(
                in_features=672,
                out_features=128
            ),
            nn.ReLU(),
            # (N, Win) -> (N, Hout)
            nn.Linear(
                in_features=128,
                out_features=out_features
            )
        )

        for module in self.modules():
            if isinstance(module, nn.Conv2d) | isinstance(module, nn.Linear):
                if isinstance(module.weight.data, torch.Tensor):
                    nn.init.xavier_uniform_(module.weight.data)
                module.bias.data.zero_

        self.target = copy.deepcopy(self.policy)
        for param in self.target.parameters():
            param.requires_grad = False

    def forward(self, x: torch.Tensor, model: Literal['policy', 'target']):
        if model == 'policy':
            return self.policy(x)

        elif model == 'target':
            return self.target(x)


class ResBlock(Module):
    def __init__(self, channels, kernel_size, padding, stride):
        super(ResBlock, self).__init__()
        self.net = nn.Sequential(
            nn.Conv2d(
                in_channels=channels,
                out_channels=channels,
                kernel_size=kernel_size,
                padding=padding,
                stride=stride
            ),
            nn.BatchNorm2d(num_features=channels),
            nn.LeakyReLU(),
            nn.Conv2d(
                in_channels=channels,
                out_channels=channels,
                kernel_size=kernel_size,
                padding=padding,
                stride=stride
            ),
            nn.BatchNorm2d(num_features=channels),
        )

    def forward(self, x):
        return F.leaky_relu(x + self.net(x))


def block(residuals, channels, kernel_size, padding, stride):
    block = [
        ResBlock(
            channels=channels,
            kernel_size=kernel_size,
            padding=padding,
            stride=stride) for _ in range(residuals)
    ]
    return nn.Sequential(*block)


class CNNResNet(Module):
    def __init__(self, out_features):
        super(CNNResNet, self).__init__()
        channels = 32
        self.conv = nn.Sequential(
            nn.Conv2d(
                in_channels=2,
                out_channels=channels,
                kernel_size=5,
                padding=2,
                stride=1
            ),
            nn.ReLU()
        )
        self.block1 = block(
            residuals=2,
            channels=channels,
            kernel_size=5,
            padding=2,
            stride=1
        )
        self.block2 = block(
            residuals=2,
            channels=channels,
            kernel_size=5,
            padding=2,
            stride=1
        )

        self.fc = nn.Sequential(
            nn.Flatten(),
            nn.Linear(
                in_features=1344,
                out_features=512
            ),
            nn.ReLU(),
            nn.Linear(
                in_features=512,
                out_features=128
            ),
            nn.ReLU(),
            nn.Linear(
                in_features=128,
                out_features=out_features)
        )
        modules = [x for x in self.modules() if isinstance(
            x, nn.Conv2d) | isinstance(x, nn.Linear)]
        self._init_wnb(*modules)

    def forward(self, x):
        # (N, Cin, Hin, Win) -> (N, Cout, Hout, Wout)
        x = self.conv(x)
        # (N, Cin, Hin, Win) -> (N, Cout, Hout, Wout)
        x = self.block1(x)
        # (N, Cin, Hin, Win) -> (N, Cout, Hout, Wout)
        x = self.block2(x)
        # (N, Cin, Hin, Win) -> (N, Hout)
        return self.fc(x)

    def _init_wnb(self, *args):
        for module in args:
            nn.init.xavier_uniform_(module.weight.data)
            module.bias.data.zero_
