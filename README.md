# Aayush Language

Aayush is a tiny Nepali chat-style programming language that uses `.aayush` files.

## Example

```aayush
maan naam = "Aayush"
maan umer chai 18

lekha "Namaste " + naam

yedi umer > 17 bhane
    lekha "Timi adult hau"
natra
    lekha "Timi ajhai sano chau"
sakiyo
```

## Keywords

| English | Aayush |
| --- | --- |
| `let` | `maan`, `maan_ki`, `maana_ki`, or `rakha` |
| `print` | `lekha`, `lekh`, or `bol` |
| `if` | `yedi` |
| `elif` | `natra_yedi` |
| `then` | `bhane` |
| `else` | `natra` |
| `end` | `sakiyo` |
| `while` | `jaba_samma` |
| `for` | `pratek` |
| `in` | `bhitra` |
| `do` | `gara` |
| `break` | `rok` |
| `continue` | `arko` |
| `def` | `kaam` |
| `return` | `firta` |
| `true` | `sahi` |
| `false` | `galat` |
| `and` | `ra` |
| `or` | `wa` |
| `not` | `haina` |

## Operators

| Symbol | Aayush |
| --- | --- |
| `=` | `chai` |
| `==` | `barabar` |
| `%` | modulo / remainder |
| `**` | power |

## Python-style features

```aayush
maan scores chai [10, 20, 30]
thap(scores, 40)

lekh "First score: " + scores[0]
scores[1] chai scores[1] + 5

maan total chai 0
pratek score bhitra scores gara
    total chai total + score
sakiyo

yedi total > 100 chabhane
    lekh "Great"
natra_yedi total > 50 chabhane
    lekh "Good"
natra
    lekh "Practice more"
sakiyo
```

Built-in helpers:

| Helper | Meaning |
| --- | --- |
| `sodha("Question: ")` / `input(...)` | asks the user for text |
| `ank(value)` / `number(value)` | converts text to a number |
| `purna(value)` / `int(value)` | converts to an integer |
| `dashamlab(value)` / `float(value)` | converts to a decimal number |
| `sabda(value)` / `str(value)` | converts to text |
| `satya(value)` / `bool(value)` | converts to true/false |
| `lambai(value)` / `len(value)` | gets string or list length |
| `sima(...)` / `range(...)` | creates a counting list for loops |
| `thap(list, value)` / `append(...)` | appends to a list |
| `nikal(list)` / `pop(...)` | removes and returns a list item |
| `prakaar(value)` / `type(value)` | returns the value type |

## Run Aayush Code From Terminal

```bash
node bin/aayush.js run examples/hello.aayush
```

Run the input calculator:

```bash
node bin/aayush.js run examples/input_calculator.aayush
```

Try the Python-style feature sample:

```bash
node bin/aayush.js run examples/python_features.aayush
```

## VS Code Extension

This folder also contains a VS Code extension skeleton. It registers `.aayush` files, syntax highlighting, indentation rules, folding, a custom file icon theme, and an `Aayush: Run File` command. The VS Code command runs in the terminal so programs can take input from the user.

After installing the extension, choose the icon theme in VS Code:

```text
Code > Settings > Theme > File Icon Theme > Aayush Icons
```

To publish later:

```bash
npm install
npm run package
```

To publish on the VS Code Marketplace:

1. Create a publisher at https://marketplace.visualstudio.com/manage.
2. Create an Azure DevOps personal access token with Marketplace publish access.
3. Install the publisher tool:
   ```bash
   npm install -g @vscode/vsce
   ```
4. Log in:
   ```bash
   vsce login your-publisher-name
   ```
5. Package and publish:
   ```bash
   vsce package
   vsce publish
   ```
