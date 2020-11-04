// ConsoleApp.cpp : This file contains the 'main' function. Program execution begins and ends there.
//

#include <iostream>

int main()
{
	int* p = 0;
	int q = 1;
	if (q)
	{
		return *(p + 1);
	}
	return 0;
}

struct MyStruct {
	int x = 3;
	double y = 2.0;
	bool z = false;
};

MyStruct global;
MyStruct& getRef() {
	return global;
}

enum NoClassEnum {
	Value1,
	Value2,
};

void C26814(NoClassEnum badEnum) {

}

void C26815() {

}

void C26816() {

}

void C26817() {
	MyStruct arr[4];
	for (auto value : arr) {
		int x = value.x;
		x++;
	}
}

void C26818(int x) {
	int result = 0;
	switch (x) {
	case 1:
		result++;
	case 2:
		result--;
		break;
		//default:
	}
}

void foo() {
	int x{};
	x++;
}

void C26820() {
	auto value = getRef();
	int x = value.x;
	x++;
}

class Class
{
	static int16_t f2(int bits) {
		if (bits <= 16 && bits > 0); else throw std::invalid_argument("Bits must be between 0 and 16");
		return 2;
	}

	int16_t f1(int bits) const {
		return f2(bits);
	}
};
