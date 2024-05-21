const CODE_SNIPPETS = {
    "javascript": `
function greet(name) {
    console.log("Hello, " + name + "!");
}

greet("World");
`,
    "typescript": `
type Params = {
    name: string;
}

function greet(data: Params) {
    console.log("Hello, " + data.name + "!");
}

greet({ name: "World" });
`,
    "python": `
def greet(name):
    print("Hello, " + name + "!")

greet("World")
`,
    "java": `
public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello World");
    }
}
`,
    "cpp": `
#include <iostream>
using namespace std;

void greet(string name) {
    cout << "Hello, " << name << "!" << endl;
}

int main() {
    greet("World");
    return 0;
}
`,
    "c": `
#include <stdio.h>

void greet(const char *name) {
    printf("Hello, %s!\\n", name);
}

int main() {
    greet("World");
    return 0;
}
`,
};

export default CODE_SNIPPETS;
