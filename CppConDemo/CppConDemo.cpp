enum class AUTH_STATE { Nothing };

struct AUTH_CONTEXT
{
	AUTH_STATE authState;
};

struct Connection
{
	AUTH_CONTEXT* context_;
};

void CleanupContext(Connection* pConnection);

void InitializeContext(Connection* pConnection)
{
	AUTH_CONTEXT* pContext = nullptr;
	if (!pConnection)
	{
		CleanupContext(pConnection);
	}
	else
	{
		pContext = pConnection->context_;
	}
	pContext->authState = AUTH_STATE::Nothing;
}
