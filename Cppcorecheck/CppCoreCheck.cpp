// ConsoleApp.cpp : This file contains the 'main' function. Program execution begins and ends there.
//

#include <iostream>

// update...

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

void RawPointerAssignment() {
	// C26400: No Raw Pointer Assignment (r.11)
	// C26409: Avoid call new or delete explicitly (r.11)
	//char* buffer = new char[30];

	// BUG: FIX
	// C26481: Don't use pointer arithmetic. Use span instead (bounds.1)
	//buffer[0] = 'a';
}

struct MyStruct {
	int x = 3;
	double y = 2.0;
	bool z = false;
	constexpr void nonConstMember() noexcept {}
	constexpr void constMember() const noexcept {}
};

void UseConstArguments(
	MyStruct* constPointer,
	MyStruct* nonConstPointer,
	MyStruct& constRef,
	MyStruct& nonConstRef) noexcept
{
	if (constPointer && nonConstPointer)
	{
		constPointer->constMember();
		nonConstPointer->nonConstMember();
		constRef.constMember();
		nonConstRef.nonConstMember();
	}
}

MyStruct global;
MyStruct& getRef() {
	return global;
}

enum NoClassEnum {
	Value1,
	Value2,
};

// C26812: The enum 'NoClassEnum' is unscoped. Prefer 'enum class' over 'enum' (Enum.3)
void C26812(NoClassEnum badEnum) {

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
